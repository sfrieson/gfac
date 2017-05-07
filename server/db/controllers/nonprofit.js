import { Nonprofit as Model } from '../models'

export default {
  update: function (id, updates) {
    return Model.findOne({query: {id}})
    .then(instance => instance.update(updates))
    .then(instance => instance.get())
  }
}
