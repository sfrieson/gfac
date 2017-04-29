import { Contact as Model, User as UserModel } from '../models'

export default {
  update(id, fields) {
    return Model.findOne({query: {userId: id}})
    .then(contact => contact.update(fields))
  }
}
