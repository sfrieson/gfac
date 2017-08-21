import pick from 'lodash/pick'
import { Contact as Model, Nonprofit } from '../models'

export default {
  create: function (data, user) {
    console.log('Contact.create')
    let getNp
    if ('nonprofitId' in data) getNp = Promise.resolve({id: data.nonprofitId})
    else {
      getNp = Nonprofit.create({
        name: data.nonprofitName,
        website: data.nonprofitWebsite
      })
    }
    const d = pick(Object.assign({}, data, user), Object.keys(Model.attributes))
    d.userId = user.id

    return getNp.then(np => (
      Model.create({...d, nonprofitId: np.id})
    )).then(contact => {
      return contact.get({plain: true})
    })
  },
  get: function (userId) {
    return Model.findOne({
      where: {userId}
    }).then(contact => {
      return contact.getNonprofit()
      .then(np => {
        const c = contact.get()
        c.nonprofit = np.get()
        return c
      })
    })
  },
  update: function (userId, fields) {
    return Model.findOne({query: {userId}})
    .then(contact => contact.update(fields))
  }
}
