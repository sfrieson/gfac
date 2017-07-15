import config from 'config'
import mailer from 'nodemailer'

import reset from './reset'

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
    return cb()
  }
}

export default {
  send: function (options) {
    return new Promise(function (resolve, reject) {
      transporter.sendMail(
        {
          from: '"Steven Frieson 👻" <sbluealien@gmail.com>',
          ...options
        },
        (err, info) => {
          if (err) reject(err)
          else resolve(info)
        }
      )
    })
  },
  reset: async function (email, link) {
    return this.send({
      to: email,
      ...reset(email, link)
    })
  }
}
