import bodyParser from 'body-parser'
import cookieParser from 'cookie-parser'
import Config from 'config'
import express from 'express'
import expressGraphQL from 'express-graphql'
import expressJWT from 'express-jwt'
import webpack from 'webpack'

import webpackConfig from '../webpack.config'
import webpackDevMiddleware from 'webpack-dev-middleware'

import mainRouter from './routers/main'

import schema from './db/queries/schema'
import models from './db/models'
import { bulkIndex } from './db/elasticlunr'

const config = Config.get('server')
const app = express()

const isDev = process.env.NODE_ENV === 'development'
const isTest = process.env.NODE_ENV === 'test'
// const isProd = process.env.NODE_ENV === 'production' || process.env.NODE_ENV === 'heroku'

app.use(express.static('./build/public'))
if (isDev) app.use(webpackDevMiddleware(webpack(webpackConfig[0])))

app.use(cookieParser())
app.use(bodyParser.urlencoded({extended: false}))
app.use(bodyParser.json())
app.use(expressJWT({
  secret: config.auth.jwtSecret,
  credentialsRequired: false,
  getToken: req => req.cookies.id_token
}).unless({path: ['/login']}))

app.use('/api', expressGraphQL((req) => ({
  schema,
  graphiql: isDev,
  rootValue: {vars: req.body, req: req},
  pretty: isDev
})))

app.use(mainRouter)

models.sync({force: isTest})
.then(bulkIndex)
.then(() => {
  const port = process.env.PORT
  app.listen(port, () => {
    console.log(`Listening on ${port}`)
  })
})
