import bodyParser from 'body-parser'
import cookieParser from 'cookie-parser'
import express from 'express'
import expressGraphQL from 'express-graphql'
import morgan from 'morgan'

// Webpack config sets environment vairable
import webpackConfig from '../webpack.config'
import { tokenMiddleware } from './utils/token-utils'

import sequelize from './db/sequelize'
import schema from './db/queries/schema'
import models from './db/models'
import { bulkIndex } from './db/elasticlunr'
import mainRouter from './routers/main'

const isDev = process.env.NODE_ENV === 'development'
const isTest = process.env.NODE_ENV === 'test'
// const isProd = process.env.NODE_ENV === 'production' || process.env.NODE_ENV === 'heroku'

const app = express()

app.use(morgan(isDev ? 'dev' : 'tiny'))
app.disable('x-powered-by')
app.use(express.static('./build/public'))
if (isDev) app.use(require('webpack-dev-middleware')(require('webpack')(webpackConfig)))

app.use(cookieParser())
app.use(bodyParser.urlencoded({extended: false}))
app.use(bodyParser.json())
app.get('/robots.txt', (req, res) => res.sendStatus(404))
app.get('/images/favicon.png', (req, res) => res.sendStatus(404))

app.use(tokenMiddleware)

app.use('/api', expressGraphQL((req) => ({
  schema,
  graphiql: isDev,
  rootValue: {vars: req.body, req: req},
  pretty: isDev
})))

app.use(mainRouter)

sequelize.authenticate()
.then(() => models.sync({force: isTest}))
.then(bulkIndex)
.then(() => {
  const port = process.env.PORT
  app.listen(port, () => {
    console.log(`Listening on ${port}`)
  })
})
