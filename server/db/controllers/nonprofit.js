import { Nonprofit as Model } from '../models'

export default {
  get: function (id) {
    return Model.findOne({where: {id}, include: Object.values(Model.associations)})
  },
  update: function (id, updates) {
    return Model.findOne({where: {id}})
    .then(instance => instance.update(updates))
    .then(instance => instance.get())
  }
}
