require('dotenv').config({path: 'config/.env.' + process.env.NODE_ENV})

const seed = require('./seed')
const sync = require('./sync')

const [,, task] = process.argv

;(new Promise(function (resolve, reject) {
  switch (task) {
    case 'build': resolve(sync(true)); break
    case 'causes':
    case 'cause': resolve(seed('causes')); break
    case 'mocks':
    case 'mock': resolve(seed('mocks')); break
    case 'seeds':
    case 'seed': resolve(seed('seed')); break
    case 'sync': resolve(sync()); break
    default: reject(new Error('Not valid command'))
  }
})).then(() => process.exit())
.catch(err => {
  console.log(err)
  process.exit(1)
})
