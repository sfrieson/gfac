import express from 'express';
import bodyParser from 'body-parser';
import cookieParser from 'cookie-parser';
import jwt from 'jsonwebtoken';
import expressGraphQL from 'express-graphql';
import expressJWT from 'express-jwt';
import bcrypt from 'bcryptjs';
const SALT = bcrypt.genSaltSync(auth.salt);

import schema from './db/schema';
import {port, auth} from './config';
import models, {User} from './db/models';
const hashPassword = (function (password) { return bcrypt.hashSync(password, SALT); });


var app = express();
import sequelize from './db/sequelize';

// TODO change to real code elsewhere
const __DEV__ = true;

app.set('views', './server/views');
app.set('view engine', 'ejs');

app.use(express.static('./build/public'));
app.use(cookieParser());
app.use(bodyParser.urlencoded({extended: false}));
app.use(bodyParser.json());

app.use(expressJWT({
  secret: auth.jwt.secret,
  credentialsRequired: false,
  getToken: req => req.cookies.id_token
}).unless({path: ['/login']}));

app.use('/api', expressGraphQL(req => ({
  schema,
  graphiql: __DEV__,
  rootValue: {request: req},
  pretty: __DEV__
})));

app.get('/', (req, res) => res.render('login'));

app.post('/login', (req, res) => {
  // TODO Authenticate User
  console.log(`Attempting Login
  Email:    ${req.body.email}
  Password: ${req.body.password}`);
  User.findOne({where: {email: req.body.email}})
  .then(user => bcrypt.compareSync(req.body.password, user.hashPassword) && user)
  .then(user => {
    res.cookie('id_token', jwt.sign({id: user.id}, auth.jwt.secret));
    res.redirect('/app');
  }).catch(err => {
    // TODO Check error
    console.log(err);
    res.redirect('/');
  });
});

app.get('/app', (req, res) => {
  if (!req.user) return res.redirect('/');

  sequelize.authenticate()
  .then(err => User.find({where: {id: req.user.id}}))
  .then(user => {
    if (user.email) res.render('index', {user: user});
    else new Error('No user');
  })
  .catch(err => res.redirect('/'));
});

app.get('/register', (req, res) => res.render('new-user', {err: [], responses: {}}));

app.post('/create-user', (req, res) => {
  const responses = req.body;

  // Validate input and strip unwanted parameters
  if (responses.password !== responses.confirm) res.render('new-user', {err: ['password'], responses: responses});
  else {
    responses.hashPassword = hashPassword(responses.password);
    User.create(responses)
    .then((user) => {
      req.user = user;
      res.cookie('id_token', jwt.sign({id: user.id}, auth.jwt.secret));
      res.redirect('/app');
    })
    .catch(() => res.send('failed'));
  }
});


models.sync({force: true}).catch(err => console.error(err.stack)).then(() => {
  app.listen(port, () => {
    console.log(`Listening on ${port}`);
  });
});
