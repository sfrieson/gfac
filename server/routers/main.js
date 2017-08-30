import qs from 'querystring'
import express from 'express'
import jwt from 'jsonwebtoken'

import config from 'config'
import User from '../db/controllers/user'
import { ValidationError } from '../errors'

import renderSpa from '../views'
import renderStatic from '../views/static'

const app = config.get('app')
const { auth, email } = config.get('server')

const Router = express.Router()

Router.use((err, req, res, nex) => {
  if (err.name === 'UnauthorizedError') console.log('\n\nFOUND THE ERROR\n\n')
})

Router.route('/admin-invite')
.get(({ query }, res) => {
  if (!('t' in query)) return res.redirect('/login')
  if (query.t.length !== app.tokenLength) return res.redirect('/login')
  User.get({loginToken: query.t})
  .then((u) => {
    if (!u) return res.redirect('/login')
    res.send(renderStatic('registerAdmin', {admin: u}))
  })
  .catch(() => res.redirect('/login'))
})
.post(/* TODO */)

Router.route('/change-password')
.get(({ query }, res) => res.send(renderStatic('changePassword', {token: query.t, email: query.email})))
.post(({ body, query }, res) => {
  User.resetPassword(body)
  .then(user => login(user, res))
  .catch(err => res.send(err.message))
})

Router.route('/reset-password')
.get(({ query }, res) => res.send(renderStatic('changePassword', {token: query.t, email: query.email})))
.post(({ body, query }, res) => {
  User.resetPassword(body)
  .then(res.json.bind(res))
  .catch(err => res.send(err.message))
})

Router.route('/forgot-password')
.get((_, res) => res.send(renderStatic('forgotPassword')))
.post(({ body }, res) => {
  User.forgotPassword(body.email)
  .then(() => (
    res.send(renderStatic('email-success', {email: body.email, expiryMin: email.expiryMin}))
  ))
  .catch(err => res.send(err.message))
})

Router.get('/logout', (req, res) => {
  res.clearCookie('id_token')
  res.redirect('/login')
})

const {fields: { causes }} = require('client-config')
Router.route('/register')
.get((req, res) => { res.send(renderStatic('register', {err: [], responses: {}, causes})) })
.post((req, res) => {
  const responses = req.body
  User.validate(responses)
  .then(() => User.create(responses))
  .then(user => login(user, res))
  .catch((err) => {
    if (err instanceof ValidationError) res.send(renderStatic('register', {err: err.errors, responses: responses, causes}))
    else if (err.message === 'Account Creation') res.status(500).send('Error: ' + err.message)
    else res.status(500).json(err)
  })
})

Router.get('/verify', ({query}, res) => {
  User.verify(query.t)
  .then(user => login(user, res))
  .catch(() => res.redirect('/login'))
})

Router.route('/login')
.get((_, res) => res.send(renderStatic('login')))
.post(({ body, query }, res) => {
  User.checkPassword(body.email, body.password)
  .then(user => {
    res.cookie('id_token', jwt.sign({id: user.id, role: user.role, nonprofitId: user.nonprofitId}, auth.jwtSecret, {expiresIn: '1h'}))
    res.redirect('next' in query ? qs.unescape(query.next) : '/')
  }).catch(err => {
    // TODO Show error to user
    console.log(err)
    res.redirect('/login' + qs.stringify(query))
  })
})

Router.use(function (req, res, next) {
  if (!req.user) {
    let query = ''
    if (req.originalUrl.length > 1) query = `?next=${qs.escape(req.originalUrl)}`
    res.redirect(`/login${query}`)
  } else next()
})

// React Router takes over from here (in the client)
Router.get('*', (req, res) => {
  if (req.user.id) res.send(renderSpa())
  else res.redirect('/login')
})

export default Router

function login (user, res, redirect = '/') {
  res.cookie('id_token', jwt.sign({id: user.id, role: user.role}, auth.jwtSecret))
  res.redirect(redirect)
}
