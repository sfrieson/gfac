import { Nonprofit as Model } from '../models'
export default {
  getAll: function (/* fields */) {
    // TODO Implement a way to just query the desired fields
    return Model.findAll({include: Object.values(Model.associations)})
    .map(i => i.get({plain: true}))
  },
  get: function (id) {
    return Model.findOne({where: {id}, include: Object.values(Model.associations)})
  },
  update: function (id, updates) {
    return Model.findOne({where: {id}})
    .then(instance => instance.update(updates))
    .then(instance => instance.get())
  }
}
