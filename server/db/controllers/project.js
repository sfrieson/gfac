import { Project as Model, Contact, Photographer } from '../models'

const photographerInclude = {model: Photographer, include: ['user']}
function flattenInstance (i) {
  const instance = i.get({plain: true})
  instance.photographers = (instance.photographers || [])
  .map(p => {
    if ('user' in p) {
      const {user, ...photographer} = p
      return {...photographer, ...user}
    } else return p
  })
  console.log(instance)
  return instance
}

export default {
  addPhotographer (id, photographerUserId) {
    return Model.findOne({where: {id}, include: [photographerInclude]})
    .then(instance => (
      instance.addPhotographer(photographerUserId)
      .then(() => instance.reload())
    ))
    .then(flattenInstance)
  },
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
    const options = {
      order: ['date'],
      where: args || {},
      include: [photographerInclude]
    }
    console.log('ProjectController#get, args:', args, 'user:', user)
    if (user.role === 'contact') options.where.nonprofitId = user.nonprofitId
    if (user.role === 'photographer') {
      options.include = [{
        model: Photographer,
        where: {userId: user.id}
      }]
    }

    return Model.findAll(options)
    .then(instances => instances.map(flattenInstance))
  },
  update (id, updates) {
    return Model.findOne({query: {id}})
    .then(instance => instance.update(updates))
    .then(instance => instance.get())
  }
}
