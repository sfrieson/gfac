import { expect } from 'chai'

import Email from './'

import emitter from 'emitter'
const baseArgs = {
  from: '"Steven Frieson 👻" <sbluealien@gmail.com>', // sender address
  to: 'ava447@gmail.com, sbluealien@hotmail.com', // list of receivers
  subject: 'Wifey Poo', // Subject line
  text: 'Hey!  Guess what?  I just emailed you from the terminal!!!', // plain text body
  html: '<b>Hey</b> Guess what?  I just emailed you from the <em>terminal!!!</em>' // html body
}

describe('Email', () => {
  describe('#send', () => {
    it('emits an event after send', (done) => {
      emitter.once('email', (err, info, options) => {
        if (err) done(err)
        else {
          console.log('info', info, 'options', options)
          expect(typeof info).to.equal('object')
          expect(typeof options).to.equal('object')
          done()
        }
      })
      Email.send(baseArgs)
    })
  })
})
