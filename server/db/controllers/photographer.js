import { pick } from 'lodash'
import { Availability, Photographer as Model } from '../models'
const AvailabilityRE = new RegExp('(\\w{2})_(\\w*)')
export default {
  create (data, user) {
    // Whitelist properties necessary for creating Photographer
    const d = pick(Object.assign(data, user, {userId: user.id}), Object.keys(Model.attributes))

    ;['cameraPhone', 'cameraDSLR', 'cameraFilm'].forEach(prop => {
      if (prop in d) d[prop] = true
    })

    d.availabilities = (typeof data.availability === 'string' ? [data.availability] : data.availability)
    .map((a) => {
      const match = a.match(AvailabilityRE)
      return {day: match[1], time: match[2]}
    })

    return Model.create(d, {include: [Availability]})
    .then(photographer => {
      return photographer.setCauses(data.causes)
      .then(() => ({
        ...photographer.get()
      }))
    })
  },
  getAll () {
    return Model.findAll({include: [{association: 'user'}]})
    .then(photographers => photographers.map((p) => {
      const {user, ...photographer} = p.get({plain: true})
      return {...user, ...photographer}
    }))
  },
  get (userId) {
    return Model.findOne({
      where: {userId},
      include: Object.values(Model.associations)
    }).then(photographer => ({
      ...photographer.get({plain: true}),
      availabilities: photographer.availabilities.map(a => (`${a.day}_${a.time}`))
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
    .then(photographer => {
      if (Object.keys(updates).length) return photographer.update(updates)
      else return photographer
    }).then(photographer => { // TODO Optimize this process
      if (availabilities) {
        return Availability.destroy({where: {photographerUserId: photographer.userId}})
        .then(() => Promise.all(availabilities.map(photographer.createAvailability.bind(photographer))))
        .then(() => photographer)
      } else return photographer
    })
    .then(photographer => {
      return photographer.getCauses()
      .then(causes => ({...photographer.get(), causes: causes.map(c => c.get())}))
    })
  }
}
