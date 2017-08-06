console.log(`
 _[]_/____\\__n_
|_____.--.__()_|
|LI  //# \\\\    |
|    \\\\__//    |
|     '--'     |
'--------------'

`)
const isProd = process.env.NODE_ENV === 'production' || process.env.NODE_ENV === 'heroku'
var appVersion = isProd ? './build/server' : './server'
require(appVersion)
