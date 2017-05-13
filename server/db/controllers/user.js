import bcrypt from 'bcryptjs'
import { pick } from 'lodash'
import { auth } from '../../config'
import { User as Model } from '../models'
import Photographer from './photographer'
import Contact from './contact'
import { ValidationError } from '../../errors'

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
    if (d.role === 'admin') throw new Error('Bad Value') // TODO Should log this attempt somehwere

    d.hashPassword = hashPassword(data.password)

    return Model.create(d)
    .then((user) => {
      console.log('user created. now to create extension', user.get())
      if (user.role === 'photographer') return this.createPhotographer(user, data)
      if (user.role === 'contact') return this.createContact(user, data)
    })
    // .then(user => {
    //   return UserLogin.create({
    //     email: user.email,
    //     hashPassword: hashPassword(data.password)
    //   }).then(() => user)
    // })
    .catch((err) => {
      console.log('account creation error', err)
      return Promise.reject(new Error('Account Creation'))
    })
  },
  createAdmin: function (data) {
    const d = pick(data, ['firstname', 'lastname', 'email', 'phone', 'phoneType'])
    d.role = 'admin'
    d.hashPassword = hashPassword(data.password)

    return Model.create(d)
    .then((user) => user.get())
    .catch((err) => {
      console.log('account creation error', err)
      return Promise.reject(new Error('Account Creation'))
    })
  },
  createContact: function (user, data) {
    return Contact.create(data, user)
    .then(contact => ({...user.get(), ...contact}))
  },
  createPhotographer: function (user, data) {
    return Photographer.create(data, user)
    .then(photographer => ({...user.get(), ...photographer}))
  },
  get: function (query, join = true) {
    console.log('getting user, query', query)
    return Model.findOne({where: query}).then(user => {
      if (join && user.role === 'photographer') return this.getPhotographer(user)
      if (join && user.role === 'contact') return this.getContact(user)
      return user.get()
    })
  },
  getContact: function (user) { // user can be Instance or object like {id: 12345}
    return Contact.get(user.id)
    .then(contact => ({
      ...user.get(),
      ...contact
    }))
  },
  getPhotographer: function (user) { // user can be Instance or object like {id: 12345}
    return Photographer.get(user.id)
    .then(photographer => ({
      ...user.get(),
      ...photographer
    }))
  },
  update: function (query, updates) {
    return Model.findOne({where: query})
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
