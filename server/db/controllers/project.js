import { Project as Model, Contact, Nonprofit, Storyteller } from '../models'
import Email from '../../email'

const storytellerInclude = {model: Storyteller, include: ['user']}
function flattenInstance (i) {
  const instance = i.get({plain: true})
  instance.storytellers = (instance.storytellers || [])
  .map(p => {
    if ('user' in p) {
      const {user, ...storyteller} = p
      return {...storyteller, ...user, userId: user.id}
    } else return p
  })

  return instance
}

export default {
  updateStoryteller (id, storytellerUserId, action) {
    return Model.findOne({where: {id}, include: [storytellerInclude]})
    .then(instance => (
      instance[action === 'add' ? 'addStoryteller' : 'removeStoryteller'](storytellerUserId)
      .then(() => instance.reload())
    ))
    .then(flattenInstance)
  },
  create (data, user) {
    console.log('Project.create')
    return new Promise((resolve, reject) => {
      // add +0000 for "no" timezone
      data.date = new Date(data.date + '+0000').toString()
      // Created by admin or nonprofitId already on Contact
      if ('nonprofitId' in data) resolve([data, {id: data.nonprofitId}])

      // Created by Nonprofit Contact
      else {
        Contact.find({where: {userId: user.id}})
        .then(c => c.getNonprofit())
        .then(np => {
          data.nonprofitId = np.id
          resolve([data, np])
        })
        .catch(reject)
      }
    }).then(([data, np]) => Promise.all([Model.create(data), Promise.resolve(np)]))
    .then(([project, np]) => {
      if ('name' in np === false) {
        Nonprofit.find({where: np})
        .then(np => Email.newProjectAlert(project, np.get({plain: true})))
      } else {
        Email.newProjectAlert(project, np)
      }

      return project
    })
  },
  get (args, user) {
    const options = {
      order: ['date'],
      where: args || {},
      include: [storytellerInclude]
    }
    console.log('ProjectController#get, args:', args, 'user:', user)
    if (user.role === 'contact') options.where.nonprofitId = user.nonprofitId
    if (user.role === 'storyteller') {
      options.include = [{
        model: Storyteller,
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
