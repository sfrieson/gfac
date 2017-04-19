import express from 'express';
import jwt from 'jsonwebtoken'

import { auth } from '../config';
import sequelize from '../db/sequelize';
import { Cause, Contact, Photographer } from '../db/models';
import User from '../controllers/user';

const Router = express.Router();

Router.route('/login')
.get((_, res) => res.render('login'))
.post((req, res) => {
  // TODO Authenticate User
  console.log(`Attempting Login
  Email:    ${req.body.email}
  Password: ${req.body.password}`);
  User.checkPassword(req.body.email, req.body.password)
  .then(user => {
    res.cookie('id_token', jwt.sign({id: user.id, role: user.role}, auth.jwt.secret));
    res.redirect('/app');
  }).catch(err => {
    // TODO Show error to user
    res.redirect('/');
  });
});

Router.route('/register')
.all((req, _, next) => {
  Cause.findAll()
  .then(causes => {
    req.causes = causes;
    next();
  });
})
.get((req, res) => res.render('register', {err: [], responses: {}, causes: req.causes}))
.post((req, res) => {
  const responses = req.body;
  console.log('Response ' + JSON.stringify(responses, null, 2));

  User.validate(responses)
  .then(() => User.create(responses))
  .then(user => {
    console.log('returned user:', user);
    req.user = user;
    res.cookie('id_token', jwt.sign({id: user.id, role: user.role}, auth.jwt.secret));
    res.redirect('/');
  })
  .catch(({type, status, message, errors}) => {
    if (type === 'Validation Error') res.render('register', {err: errors, responses: responses, causes: req.causes});
    if (type === 'Account Creation') res.status(status).send(message);
  });
});

// React Router takes over from here
Router.get('/', (req, res) => {
  if (!req.user) return res.redirect('/login');

  sequelize.authenticate()
  .then(err => User.get({id: req.user.id}))
  .then(user => {
    if (user.email) res.render('index', {user: user});
    else new Error('No user');
  })
  .catch(err => res.redirect('/login'));
});

export default Router;