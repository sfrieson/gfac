import { Contact as Model } from '../models'

export default {
  update (id, fields) {
    return Model.findOne({query: {userId: id}})
    .then(contact => contact.update(fields))
  }
}
