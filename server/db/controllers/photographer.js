import { Photographer as Model, User as UserModel } from '../models'

export default {
  update: function (id, fields) {
    return Model.findOne({query: {userId: id}})
    .then(photographer => photographer.update(fields))
    .then(photographer => {
      return photographer.getCauses().then(causes => {
        return {
          ...photographer.get(),
          causes: causes.map(c => c.get())
        }
      })
    })
  }
}
