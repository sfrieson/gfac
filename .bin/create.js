import { UserController as User } from '../server/db/controllers'
import readline from 'readline'
const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout
})

/**
  * Command arguments
  * @index[0] {String} binary location ('node')
  * @index[1] {String} file location ('create.js')
  * @index[2] {String} double dash ('--')
  * @index[3] {String} object to create ('admin', etc.)
**/
const [,,, object] = process.argv

switch (object) {
  case 'admin':
    createAdmin()
    .then(() => process.exit())
    .catch(() => process.exit(1))
    break
  default:
    console.log(`Creating ${object} not supported.`)
    process.exit(1)
}

function createAdmin () {
  console.log(`Creating Admin`)
  let answers = {}
  return question('First name: ').then(res => { answers.firstname = res })
  .then(response => question('Last name: ').then(res => { answers.lastname = res }))
  .then(response => question('Email: ').then(res => { answers.email = res }))
  .then(response => new Promise((resolve, reject) => hidden('Password: ', resolve)).then(res => { answers.password = res }))
  .then(() => User.createAdmin(answers))
}

function question (prompt) {
  return new Promise((resolve, reject) => rl.question(prompt, resolve))
}
function hidden (query, callback) {
  var stdin = process.openStdin()
  process.stdin.on('data', function (char) {
    char = char + ''
    switch (char) {
      case '\n':
      case '\r':
      case '\u0004':
        stdin.pause()
        break
      default:
        process.stdout.write('\x1B[2K\x1B[200D' + query + '🔑 ')
        break
    }
  })

  rl.question(query, function (value) {
    rl.history = rl.history.slice(1)
    callback(value)
  })
}
