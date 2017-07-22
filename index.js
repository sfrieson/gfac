var fs = require('fs')
var config = require('config')
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
require('./server')
