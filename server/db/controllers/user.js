import bcrypt from 'bcryptjs'
import { pick } from 'lodash'
import config from 'config'
import { User as Model, Photographer as PhotographerModel } from '../models'
import Photographer from './photographer'
import Contact from './contact'
import Email from '../../email'
import { ValidationError } from '../../errors'

const { auth } = config.get('server')
const SALT = bcrypt.genSaltSync(auth.salt)

const User = {
  changePassword: function (user, password, confirm) {
    if (password !== confirm) return Promise.reject(new Error('Password and confirmation did not match.'))
    return Model.findOne({where: {id: user.id}})
    .then(u => u.update({passwordHash: this.hashPassword(password)}))
    .then(() => 'Successful')
    .catch(err => Promise.reject(err))
  },
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

    d.hashPassword = this.hashPassword(data.password)

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
    d.hashPassword = this.hashPassword(data.password)

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
    return Model.findOne({where: query})
    .then(user => {
      if (user) return user
      throw new Error('No user')
    })
    .then(user => {
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
    console.log('getPhotographer, user:', user.get())
    return Photographer.get(user.id)
    .then(photographer => ({
      ...user.get(),
      ...photographer
    }))
    .then(p => {
      console.log('full user:', p)
      return p
    })
  },
  hashPassword: function (password) { return bcrypt.hashSync(password, SALT) },
  passwordResetLink: function ({email}) {
    const loginToken = generateToken(25)
    const tokenExpires = Date.now() + (1000 * 60 * 10)

    Model.findOne({where: {email}})
    .then(m => m.update({loginToken, tokenExpires}))
    .then(m => {
      // Email m.email the url
      const resetUrl = `http://gramforacause.com/reset-password?email=${m.email}&t=${loginToken}`
      return resetUrl
    })
  },
  resetPassword: function ({email, token, password, confirm}) {
    return new Promise(function (resolve, reject) {
      if (password !== confirm) return reject(new Error('Password does not match confirm'))

      Model.findOne({where: {email, loginToken: token}})
      .then(m => {
        if (m) return m
        else throw new Error('Reset did not work.')
      })
      .then(m => {
        const emptyToken = {loginToken: '', tokenExpires: 0}

        if (m.tokenExpires < Date.now()) {
          m.update(emptyToken)
          throw new Error('Reset did not work.')
        }

        return m.update({
          hashPassword: this.hashPassword(password),
          ...emptyToken
        }).then(() => resolve(m.get()))
      })
      .catch((err) => reject(err))
    })
  },
  search: function (query) {
    const queryKeys = Object.keys(query)
    let where = {}
    let userIncludeWhere = {}
    let prop
    const userWhere = pick({
      firstname: query.firstname && {$iLike: `%${query.firstname}%`},
      lastname: query.lastname && {$iLike: `%${query.lastname}%`},
      role: (query.firstname || query.lastname) && query.role
    }, queryKeys)
    for (prop in userWhere) if (userWhere[prop]) userIncludeWhere[prop] = userWhere[prop]

    where = {}
    const include = [Object.assign(userIncludeWhere, {
      association: PhotographerModel.associations.user
    })]
    const photoWhere = pick({
      instagram: query.instagram && {$iLike: `%${query.instagram}%`},
      cameraDSLR: query.cameraDSLR,
      cameraPhone: query.cameraPhone,
      cameraFilm: query.cameraFilm
    }, queryKeys)

    for (prop in photoWhere) if (photoWhere[prop]) where[prop] = photoWhere[prop]
    if (query.availabilities) {
      include.push({
        association: PhotographerModel.associations.availabilities,
        where: query.availabilities.reduce((where, a, i, availabilities) => {
          const [day, time] = a.split('_')
          if (availabilities.length === 1) return {day, time}
          where.$or.push({day, time})
          return where
        }, {$or: []})
      })
    }
    if (query.interests) {
      include.push({
        association: PhotographerModel.associations.causes,
        // as: 'interests', // not needed because not returned in search
        where: query.interests.reduce((where, a, _, interests) => {
          const id = {id: a}
          if (interests.length === 1) return id
          where.$or.push(id)
          return where
        }, {$or: []})
      })
    }

    return PhotographerModel.findAll({where, include})
    .then(photogs => photogs.map(p => Object.assign(p.user.get(), p.get())))
  },
  sendResetEmail: function (email) {
    return this.get({email})
    .then(user => (
      Email.reset(user.email)
    ))
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

const possible = 'abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ1234567890!$^-+_'.split('')
function generateToken (length) {
  let pass = ''
  while (--length) pass += randomChar()
  return pass
}
function randomChar () { return possible[Math.floor(Math.random() * possible.length)] }
