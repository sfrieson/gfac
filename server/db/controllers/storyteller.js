import pick from 'lodash/pick'
import { Availability, Storyteller as Model } from '../models'
const AvailabilityRE = new RegExp('(\\w{2})_(\\w*)')
export default {
  create (data, user) {
    // Whitelist properties necessary for creating Storyteller
    const d = pick(Object.assign(data, user, {userId: user.id}), Object.keys(Model.attributes))

    ;['cameraPhone', 'cameraDSLR', 'cameraFilm'].forEach(prop => {
      if (prop in d) d[prop] = true
    })

    data.availability = data.availability || []
    d.availabilities = (typeof data.availability === 'string' ? [data.availability] : data.availability)
    .map((a) => {
      const match = a.match(AvailabilityRE)
      return {day: match[1], time: match[2]}
    })

    return Model.create(d, {include: [Availability]})
  },
  getAll () {
    return Model.findAll({include: ['user', 'availabilities', 'causes']})
    .then(storytellers => storytellers.map((p) => {
      const {user, ...storyteller} = p.get({plain: true})
      return {...user, ...storyteller}
    }))
  },
  get (userId) {
    return Model.findOne({
      where: {userId},
      include: Object.values(Model.associations)
    }).then(storyteller => ({
      ...storyteller.get({plain: true}),
      availabilities: storyteller.availabilities.map(a => (`${a.day}_${a.time}`))
    }))
  },
  update (userId, { availabilities, ...updates }) {
    if (availabilities) {
      availabilities =
      (typeof availabilities === 'string' ? [availabilities] : availabilities)
      .map((a) => {
        const match = a.match(AvailabilityRE)
        return {day: match[1], time: match[2]}
      })
    }

    return Model.findOne({where: {userId}})
    .then(storyteller => {
      if (Object.keys(updates).length) return storyteller.update(updates)
      else return storyteller
    }).then(storyteller => { // TODO Optimize this process
      if (availabilities) {
        return Availability.destroy({where: {storytellerUserId: storyteller.userId}})
        .then(() => Promise.all(availabilities.map(storyteller.createAvailability.bind(storyteller))))
        .then(() => storyteller)
      } else return storyteller
    })
    .then(storyteller => {
      return storyteller.getCauses()
      .then(causes => ({...storyteller.get(), causes: causes.map(c => c.get())}))
    })
  }
}
