import { Nonprofit as Model } from '../models'

const associations = Object.values(Model.associations)

export default {
  getAll: function (/* fields */) {
    // TODO Implement a way to just query the desired fields
    return Model.findAll({include: associations})
    .map(i => i.get({plain: true}))
  },
  get: function (id) {
    return Model.findOne({where: {id}, include: associations})
  },
  update: function (id, updates) {
    return Model.findOne({where: {id}})
    .then(instance => instance.update(updates))
    .then(instance => instance.get())
  }
}
