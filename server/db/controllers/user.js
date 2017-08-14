import bcrypt from 'bcryptjs'
import { pick as whitelist } from 'lodash'
import config from 'config'
import { User as Model, Storyteller as StorytellerModel } from '../models'
import Contact from './contact'
import Nonprofit from './nonprofit'
import Storyteller from './storyteller'
import Email from '../../email'
import { ValidationError } from '../../errors'

const app = config.get('app')
const { auth, email } = config.get('server')
const SALT = bcrypt.genSaltSync(auth.salt)

export default {
  changePassword: function (user, password, confirm) {
    if (password !== confirm) return Promise.reject(new Error('Password and confirmation did not match.'))
    return Model.findOne({where: {id: user.id}})
    .then(u => u.update({hashPassword: hashPassword(password)}))
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
    const d = whitelist(data, ['firstname', 'lastname', 'email', 'role', 'phone', 'phoneType'])
    if (d.role === 'admin') throw new Error('Bad Value') // TODO Should log this attempt somehwere
    d.hashPassword = hashPassword(data.password)
    d.loginToken = generateToken(app.tokenLength)

    return Model.create(d)
    .then((user) => {
      if (user.role === 'storyteller') return this.createStoryteller(user, data)
      if (user.role === 'contact') return this.createContact(user, data)
    })
    .then((user) => (
      Email.verify({
        email: user.email,
        link: `${app.url}/verify?t=${user.loginToken}`
      }).then(() => user)
    ))
  },
  createAdmin: function (data) {
    const d = whitelist(data, ['firstname', 'lastname', 'email', 'phone', 'phoneType'])
    d.role = 'admin'
    if ('password' in data) d.hashPassword = hashPassword(data.password)

    return Model.create(d)
    .then((user) => user.get())
    .catch((err) => {
      return Promise.reject(new Error('Account Creation:\n', err))
    })
  },
  createContact: function (user, data) {
    return Contact.create(data, user)
    .then(contact => ({...user.get(), ...contact}))
  },
  createStoryteller: function (user, data) {
    return Storyteller.create(data, user)
    .then(storyteller => ({...user.get(), ...storyteller}))
  },
  forgotPassword: function (email) {
    return this.getInstance({email})
    .then(user => this.makePasswordResetLink(user))
    .then(({email, link}) => Email.reset({email, link}))
  },
  get: function (query, join = true) {
    return this.getInstance(query)
    .then(user => {
      if (join && user.role === 'storyteller') return this.getStoryteller(user)
      if (join && user.role === 'contact') return this.getContact(user)
      console.log(user.get())
      return user.get()
    })
  },
  getInstance: function (query) {
    return Model.findOne({where: query})
    .then(user => {
      if (user) return user
      throw new Error('No user')
    })
  },
  getContact: function (user) { // user can be Instance or object like {id: 12345}
    return Contact.get(user.id)
    .then(contact => ({
      ...user.get(),
      ...contact
    }))
  },
  getStoryteller: function (user) { // user can be Instance or object like {id: 12345}
    return Storyteller.get(user.id)
    .then(storyteller => ({
      ...user.get(),
      ...storyteller
    }))
  },
  hashPassword: hashPassword,
  inviteAdmin: function (opts) {
    const loginToken = generateToken(app.tokenLength)
    const tokenExpires = Date.now() + (email.inviteWeeks * 7 * 24 * 60 * 60 * 1000) + ''
    return this.createAdmin({...opts, loginToken, tokenExpires})
    .then(() => ({
      ...whitelist(opts, ['firstname', 'lastname', 'email']),
      role: 'admin',
      link: `${app.url}/admin-invite?t=${loginToken}`
    }))
    .then(opts => Email.invite(opts))
  },
  inviteContact: function (opts, nonprofitId) {
    const loginToken = generateToken(app.tokenLength)
    const tokenExpires = Date.now() + (email.inviteWeeks * 7 * 24 * 60 * 60 * 1000) + ''

    return Model.create({
      ...whitelist(opts, ['firstname', 'lastname', 'email']),
      role: 'contact',
      nonprofit_id: nonprofitId,
      loginToken,
      tokenExpires
    })
    .then(i => Contact.create({nonprofitId}, i))
    .then(() => Nonprofit.get(nonprofitId))
    .then((np) => ({...opts, role: 'contact', link: `${app.url}/nonprofit-invite?t=${loginToken}`, nonprofit: np.name}))
    .then(opts => Email.invite(opts))
  },
  makePasswordResetLink: function (user) {
    const loginToken = generateToken(app.tokenLength)
    const tokenExpires = Date.now() + (email.expiryMin * 60 * 1000) + ''

    return user.update({loginToken, tokenExpires})
    .then(u => ({
      email: u.email,
      link: `${app.url}/reset-password?email=${u.email}&t=${loginToken}`
    }))
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

        if (+m.tokenExpires < Date.now()) {
          m.update(emptyToken)
          throw new Error('Reset didn\'t work.')
        }

        return m.update({
          hashPassword: hashPassword(password),
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
    const userWhere = whitelist({
      firstname: query.firstname && {$iLike: `%${query.firstname}%`},
      lastname: query.lastname && {$iLike: `%${query.lastname}%`},
      role: (query.firstname || query.lastname) && query.role
    }, queryKeys)
    for (prop in userWhere) if (userWhere[prop]) userIncludeWhere[prop] = userWhere[prop]

    where = {}
    const include = [Object.assign(userIncludeWhere, {
      association: StorytellerModel.associations.user
    })]
    const photoWhere = whitelist({
      instagram: query.instagram && {$iLike: `%${query.instagram}%`},
      cameraDSLR: query.cameraDSLR,
      cameraPhone: query.cameraPhone,
      cameraFilm: query.cameraFilm
    }, queryKeys)

    for (prop in photoWhere) if (photoWhere[prop]) where[prop] = photoWhere[prop]
    if (query.availabilities) {
      include.push({
        association: StorytellerModel.associations.availabilities,
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
        association: StorytellerModel.associations.causes,
        // as: 'interests', // not needed because not returned in search
        where: query.interests.reduce((where, a, _, interests) => {
          const id = {id: a}
          if (interests.length === 1) return id
          where.$or.push(id)
          return where
        }, {$or: []})
      })
    }

    return StorytellerModel.findAll({where, include})
    .then(storytellers => storytellers.map(p => Object.assign(p.user.get(), p.get())))
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
  },
  verify: function (loginToken) {
    return this.getInstance({loginToken})
    .then(u => {
      if (u) {
        return u.update({
          loginToken: '',
          tokenExpires: 0,
          emailConfirmed: true
        })
      } else throw new Error('No user')
    })
  }
}

const possible = 'abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ1234567890!$^-+_'.split('')
function generateToken (length) {
  let pass = ''
  while (--length) pass += randomChar()
  return pass
}
function randomChar () { return possible[Math.floor(Math.random() * possible.length)] }
function hashPassword (password) { return bcrypt.hashSync(password, SALT) }
