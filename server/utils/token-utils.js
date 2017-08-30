import jwt from 'jsonwebtoken'
import config from 'config'

// Inspired by https://gist.github.com/ziluvatar/a3feb505c4c0ec37059054537b38fc48
const secret = config.get('server.auth.jwtSecret')
// const options = {expiresIn: '1h'}

// function sign (payload, signOptions) {
//   const jwtSignOptions = Object.assign({}, signOptions, options)
//   return jwt.sign(payload, secret, jwtSignOptions)
// }

// refreshOptions.verify = options you would use with verify function
// refreshOptions.jwtid = contains the id for the new token
// function refresh (oldPayload) {
//   const payload = {...oldPayload}
//   delete payload.iat
//   delete payload.exp
//   delete payload.nbf
//   delete payload.jti // We are generating a new token, if you are using jwtid during signing, pass it in refreshOptions
//   const jwtSignOptions = Object.assign({ }, options)
//   // The first signing converted all needed options into claims, they are already in the payload
//   return jwt.sign(payload, secret, jwtSignOptions)
// }

function verify (token) {
  return jwt.verify(token, secret)
}

// function reset () {}

export function tokenMiddleware (req, res, next) {
  if ('id_token' in req.cookies === false) return next()
  let decoded
  try {
    decoded = verify(req.cookies.id_token)
    req.user = decoded
  } catch (err) {
    // TODO Send reset cookie and let the router take care of the rest.
  }
  next()
}
