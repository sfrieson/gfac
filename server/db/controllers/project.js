import { omit } from 'lodash'
import { Project as Model } from '../models'

export default {
  create (data) {
    const d = omit(data, ['nonprofitId'])
    d.date = new Date(d.date + '+0000').toString()
    return Model.create(d)
    .then(project => project.setNonprofit(data.nonprofitId))
    .then(p => { console.log('p?', p.get && p.get()); return p })
  },
  get (args, user) {
    const order = ['date']
    const query = {}
    if (user.role === 'contact') query.nonprofitId = user.nonprofitId
    if (user.role === 'photographer') query.photographerId = user.id

    return Model.findAll({query, order})
  },
  update (id, updates) {
    return Model.findOne({query: {id}})
    .then(instance => instance.update(updates))
    .then(instance => instance.get())
  }
}
