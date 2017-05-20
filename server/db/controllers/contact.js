import { pick } from 'lodash'
import { Contact as Model, Nonprofit } from '../models'

export default {
  create: function (data, user) {
    let getNonprofit
    if (data.nonprofit === 'new') {
      getNonprofit = Nonprofit.create({
        name: data.nonprofit_name,
        description: data.nonprofit_description
      }).then(np => {
        return np
      })
    } else if (data.nonprofit === 'existing') {
      getNonprofit = Nonprofit.findOne({query: {id: data.nonprofit_accesscode}}) // TODO Should this not use the ID?
    }

    const d = pick(Object.assign({}, data, user), Object.keys(Model.attributes))
    d.userId = user.id

    return getNonprofit.then(np => {
      d.nonprofitId = np.id
      return Model.create(d)
    }).then(contact => {
      return contact.get()
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
