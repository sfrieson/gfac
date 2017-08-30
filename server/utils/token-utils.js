import jwt from 'jsonwebtoken'
import config from 'config'

// Inspired by https://gist.github.com/ziluvatar/a3feb505c4c0ec37059054537b38fc48
const secret = config.get('server.auth.jwtSecret')
const options = {expiresIn: '1h'}

export function sign (payload, signOptions) {
  const jwtSignOptions = Object.assign({}, signOptions, options)
  return jwt.sign(payload, secret, jwtSignOptions)
}

function refresh (oldPayload) {
  const payload = {...oldPayload}
  delete payload.iat
  delete payload.exp
  delete payload.nbf
  delete payload.jti
  // The first signing converted all needed options into claims, they are already in the payload
  return jwt.sign(payload, secret, options)
}

function verify (token) {
  return jwt.verify(token, secret)
}

export function tokenMiddleware (req, res, next) {
  if ('id_token' in req.cookies === false) return next()
  let decoded
  try {
    decoded = verify(req.cookies.id_token)
    if (decoded < tenMinFromNow()) res.cookie('id_token', refresh(decoded))
    req.user = decoded
  } catch (err) {
    // TODO do we not want to clear out for UX of prefilling email field next time they visit or for analytics(???)
    res.clearCookie('id_token')
  }
  next()
}

function tenMinFromNow () {
  const tenMin = 10 * 60

  const nowMilli = Date.now()
  const now = (nowMilli - nowMilli % 1000) / 1000

  return now + tenMin
}
