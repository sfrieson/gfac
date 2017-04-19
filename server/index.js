import bodyParser from 'body-parser';
import cookieParser from 'cookie-parser';
import express from 'express';
import expressGraphQL from 'express-graphql';
import expressJWT from 'express-jwt';

import mainRouter from './routers/main';

import schema from './db/schema';

import {port, auth} from './config';
import models from './db/models';


var app = express();

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

app.use(mainRouter);

// TODO Spruce up 404
app.get('*', (req, res) => res.sendStatus(404));

models.sync({force: true}).catch(err => console.error(err.stack)).then(() => {
  app.listen(port, () => {
    console.log(`Listening on ${port}`);
  });
});
