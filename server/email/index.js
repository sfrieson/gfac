import config from 'config'
import mailer from 'nodemailer'

import emitter from 'emitter'
import reset from './reset'
import invite from './invite'

const { transporter } = mailer.createTransport(config.get('server.email'))

// setup email data with unicode symbols
// let mailOptions = {
//   from: '"Steven Frieson 👻" <sbluealien@gmail.com>', // sender address
//   to: 'ava447@gmail.com, sbluealien@hotmail.com', // list of receivers
//   subject: 'Wifey Poo', // Subject line
//   text: 'Hey!  Guess what?  I just emailed you from the terminal!!!', // plain text body
//   html: '<b>Hey</b> Guess what?  I just emailed you from the <em>terminal!!!</em>' // html body
// }

// send mail with defined transport object
// transporter.sendMail(mailOptions, (error, info) => {
//   if (error) {
//     console.log(error)
//     return process.exit(1)
//   }
//   console.log('Message %s sent: %s', info.messageId, info.response)
//   process.exit()
// })

if (process.env.NODE_ENV === 'development') {
  transporter.sendMail = function (opts, cb) {
    console.log(opts)
    return cb(null, {})
  }
}
if (process.env.NODE_ENV === 'test') transporter.sendMail = (_, cb) => cb(null, {})

export default {
  send: function (options) {
    const opts = {
      from: '"Steven Frieson 👻" <sbluealien@gmail.com>',
      ...options
    }
    return new Promise(function (resolve, reject) {
      transporter.sendMail(
        opts,
        // Details for info argument: https://nodemailer.com/usage/#sending-mail
        (err, info) => {
          emitter.emit('email', err, info, opts)
          if (err) reject(err)
          else {
            resolve(info)
          }
        }
      )
    })
  },
  invite: async function (options) {
    return this.send({
      to: options.email,
      ...invite(options)
    })
  },
  reset: async function (email, link) {
    return this.send({
      to: email,
      ...reset({email, link})
    })
  }
}
