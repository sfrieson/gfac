import { expect } from 'chai'

import emitter from 'emitter'
import User from './user'

describe('Controller: User', () => {
  describe('#inviteAdmin', () => {
    const opts = {
      firstname: 'Ally',
      lastname: 'Admin',
      email: 'admin@me.com'
    }

    let emailEvent

    before((done) => {
      emailEvent = new Promise((resolve) => {
        emitter.once('email', function () { resolve(arguments) })
      })

      User.inviteAdmin(opts)
      .then((opts) => { done(); return opts })
    })

    after((done) => {
      User.getInstance({email: opts.email})
      .then(u => u.destroy())
      .then(() => done())
    })

    it('creates a base account', (done) => {
      User.get({email: opts.email})
      .then(u => expect(Object.keys(u).length).to.be.gt(0))
      .then(() => done())
      .catch(err => done(err))
    })

    it('sends the correct user an email', (done) => {
      emailEvent.then(([err, info, emailOpts]) => {
        if (err) throw err
        expect(emailOpts.to).to.equal(opts.email)
        done()
      })
      .catch(err => done(err))
    })

    it('sends the message', (done) => {
      emailEvent.then(([err, info, emailOpts]) => {
        if (err) throw err
        expect(emailOpts.html.indexOf('What power!')).to.be.gt(-1)
        done()
      })
      .catch(err => done(err))
    })
  })
})
