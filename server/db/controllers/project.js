import { omit } from 'lodash'
import { Project as Model, Nonprofit } from '../models'

export default {
  create (data) {
    const d = omit(data, ['nonprofitId'])
    d.date = new Date(d.date + '+0000').toString()
    return Model.create(d)
    .then(project => project.setNonprofit(data.nonprofitId))
    .then(p => { console.log('p?', p.get && p.get()); return p })
  },
  get (id) {

  },
  update (id, fields) {

  }
}
