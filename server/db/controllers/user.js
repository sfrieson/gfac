import bcrypt from 'bcryptjs'
import { pick } from 'lodash'
import { auth } from '../../config'
import { Availability, Contact, Photographer as PhotoModel, User as UserModel } from '../models'
import { ValidationError } from '../../errors'

const AvailabilityRE = new RegExp('(\\w{2})_(\\w*)')
const SALT = bcrypt.genSaltSync(auth.salt)

const hashPassword = function (password) { return bcrypt.hashSync(password, SALT) }

const User = {
  checkPassword: function (email, password) {
    return this.get({email})
    .then(user => {
      if (!user) throw new Error('Incorrect user or password.')
      if (bcrypt.compareSync(password, user.hashPassword)) return user
      else throw new Error('Incorrect user or password.')
    })
  },
  create: function (data) {
    // Whitelist properties necessary for creating User
    const d = pick(data, ['firstname', 'lastname', 'email', 'role', 'phone', 'phoneType'])
    d.hashPassword = hashPassword(data.password)

    return UserModel.create(d)
    .then((user) => {
      if (user.role === 'photographer') return this.createPhotographer(user, data)
      if (user.role === 'nonprofit') return this.createContact(user, data)
    })
    .catch(() => Promise.reject(new Error('Account Creation')))
  },
  createContact: function (user, data) { return user },
  createPhotographer: function (user, data) {
    // Whitelist properties necessary for creating Photographer
    const d = pick(Object.assign(data, user), Object.keys(PhotoModel.attributes))
    d.userId = user.id

    ;['cameraPhone', 'cameraDSLR', 'cameraFilm'].forEach(prop => {
      if (prop in d) d[prop] = true
    })

    d.availabilities = (typeof data.availability === 'string' ? [data.availability] : data.availability)
    .map((a) => {
      const match = a.match(AvailabilityRE)
      return {day: match[1], time: match[2]}
    })

    return PhotoModel.create(d, {include: [Availability]})
    .then(photographer => {
      return photographer.setCauses(data.causes)
      .then(() => ({
        ...user.get(),
        ...photographer.get()
      }))
    })
  },
  get: function (query, join = true) {
    return UserModel.findOne({where: query}).then(user => {
      if (join && user.role === 'photographer') return this.getPhotographer(user)
      if (join && user.role === 'contact') return this.getContact(user)
      return user.get()
    })
  },
  getContact: function (user) { // user can be Instance or object like {id: 12345}
    return Contact.findOne({
      query: {id: user.id}
    }).then(contact => ({
      ...user.get(),
      ...contact.get()
    }))
  },
  getPhotographer: function (user) { // user can be Instance or object like {id: 12345}
    return PhotoModel.findOne({
      query: {id: user.id},
      include: [PhotoModel.associations.causes, PhotoModel.associations.availabilities]
    }).then(photographer => ({
      ...user.get(),
      ...photographer.get(),
      availabilities: photographer.availabilities.map(a => (`${a.day}_${a.time}`))
    }))
  },
  update: function (query, updates) {
    return UserModel.findOne({where: query})
    .then(user => user.update(updates))
    .then(user => user.get())
  },
  validate: function (data) {
    const errors = []

    if (!data.password || data.password !== data.confirm) errors.push('Password does not match.')
    if (errors.length === 0) return Promise.resolve(data)
    else return Promise.reject(new ValidationError('Account Creation', errors))
  }
}

export default User
