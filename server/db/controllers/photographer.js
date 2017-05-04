import { pick } from 'lodash'
import { Availability, Photographer as Model } from '../models'
const AvailabilityRE = new RegExp('(\\w{2})_(\\w*)')
export default {
  create (data, user) {
    // Whitelist properties necessary for creating Photographer
    const d = pick(Object.assign(data, user), Object.keys(Model.attributes), {userId: user.id})

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
  get (id) {
    return Model.findOne({
      query: {id},
      include: [Model.associations.causes, Model.associations.availabilities]
    }).then(photographer => ({
      ...photographer.get(),
      availabilities: photographer.availabilities.map(a => (`${a.day}_${a.time}`))
    }))
  },
  update (id, { availabilities, ...updates }) {
    if (availabilities) {
      availabilities =
      (typeof availabilities === 'string' ? [availabilities] : availabilities)
      .map((a) => {
        const match = a.match(AvailabilityRE)
        return {day: match[1], time: match[2]}
      })
    }

    return Model.findOne({query: {userId: id}})
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
