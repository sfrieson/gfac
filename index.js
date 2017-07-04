var fs = require('fs')
var config = require('config')

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
