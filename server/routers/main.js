import express from 'express'
import jwt from 'jsonwebtoken'

import { auth } from '../config'
import sequelize from '../db/sequelize'
import { Cause } from '../db/models'
import User from '../db/controllers/user'
import { ValidationError } from '../errors'

const Router = express.Router()

Router.route('/change-password')
.get(({ query }, res) => res.json(query))
.post(({ body, query }, res) => {
  res.json({req: {body, query}})
})

Router.route('/login')
.get((_, res) => res.render('login'))
.post(({ body }, res) => {
  console.log(`Attempting Login
  Email:    ${body.email}
  Password: ${body.password}`)
  User.checkPassword(body.email, body.password)
  .then(user => {
    res.cookie('id_token', jwt.sign({id: user.id, role: user.role, nonprofitId: user.nonprofitId}, auth.jwt.secret))
    res.redirect('/')
  }).catch(err => {
    // TODO Show error to user
    console.log(err)
    res.redirect('/login')
  })
})

Router.get('/logout', (req, res) => {
  res.clearCookie('id_token')
  res.redirect('/login')
})

Router.route('/register')
.all((req, _, next) => {
  Cause.findAll()
  .then(causes => {
    req.causes = causes
    next()
  })
})
.get((req, res) => { res.render('register', {err: [], responses: {}, causes: req.causes}) })
.post((req, res) => {
  const responses = req.body
  console.log('Response ' + JSON.stringify(responses, null, 2))

  User.validate(responses)
  .then(() => User.create(responses))
  .then(user => {
    console.log('returned user:', user)
    req.user = user
    res.cookie('id_token', jwt.sign({id: user.id, role: user.role}, auth.jwt.secret))
    res.redirect('/')
  })
  .catch((err) => {
    if (err instanceof ValidationError) res.render('register', {err: err.errors, responses: responses, causes: req.causes})
    if (err.message === 'Account Creation') res.status(500).send('Error: ' + err.message)
  })
})

// React Router takes over from here
Router.get('*', (req, res) => {
  if (!req.user) return res.redirect('/login')

  sequelize.authenticate()
  .then(() => User.get({id: req.user.id}))
  .then(user => {
    if (user.email) res.render('index', {user: user})
    else throw new Error('No user')
  })
  .catch(_err => res.redirect('/login'))
})

export default Router
