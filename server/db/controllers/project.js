import { Project as Model, Contact } from '../models'

export default {
  create (data, user) {
    return new Promise((resolve, reject) => {
      // add +0000 for "no" timezone
      data.date = new Date(data.date + '+0000').toString()

      // Created by admin or nonprofitId already on Contact
      if ('nonprofitId' in data) resolve(data)

      // Created by Nonprofit Contact
      else {
        Contact.find({where: {userId: user.id}})
        .then(c => c.getNonprofit())
        .then(np => {
          data.nonprofitId = np.id
          resolve(data)
        })
      }
    }).then(data => Model.create(data))
  },
  get (args, user) {
    const order = ['date']
    const where = {}
    console.log('ProjectController#get, user:', user)
    if (user.role === 'contact') where.nonprofitId = user.nonprofitId
    if (user.role === 'photographer') where.photographerId = user.id

    return Model.findAll({where, order})
  },
  update (id, updates) {
    return Model.findOne({query: {id}})
    .then(instance => instance.update(updates))
    .then(instance => instance.get())
  }
}
