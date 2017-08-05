var fs = require('fs')
var config = require('config')
const isProd = process.env.NODE_ENV === 'heroku' || process.env.NODE_ENV === 'production'
require('dotenv').config({path: 'config/.env.' + process.env.NODE_ENV})

// Prepare config for client
fs.writeFileSync(
  'client-config.json',
  JSON.stringify(config.get('client'))
)

console.log(`
 _[]_/____\\__n_
|_____.--.__()_|
|LI  //# \\\\    |
|    \\\\__//    |
|     '--'     |
'--------------'

`)
var appVersion = isProd ? './build/server' : './server'
require(appVersion)
