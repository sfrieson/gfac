require('dotenv').config({path: 'config/.env.' + process.env.NODE_ENV})

const seed = require('./seed').default

const [,, task] = process.argv

if (/seed/.test(task)) seed('seed').then(() => process.exit())
if (/mock/.test(task)) seed('mocks').then(() => process.exit())
