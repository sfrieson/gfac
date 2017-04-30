import { Availability, Photographer as Model } from '../models'
const AvailabilityRE = new RegExp('(\\w{2})_(\\w*)')
export default {
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
