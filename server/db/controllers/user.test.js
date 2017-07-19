import { expect } from 'chai'

import emitter from 'emitter'
import User from './user'

describe('Controller: User', () => {
  describe('#create', () => {
    let emailEvent
    let userPromise
    const opts = {
      firstname: 'Phil',
      lastname: 'Photogs',
      email: 'phil@pho.to',
      role: 'photographer',
      phoneType: 'mobile',
      phone: '6106106100',
      password: 'password1234',
      instagram: 'grammergrammar',
      availability: ['Mo_evening'],
      causes: [1]
    }

    before((done) => {
      emailEvent = new Promise((resolve) => {
        emitter.once('email', function () { resolve(arguments) })
      })

      userPromise = User.create(opts)
      .then((u) => { done(); return u })
    })

    after((done) => {
      User.getInstance({email: opts.email})
      .then(u => u.destroy({force: true}))
      .then(() => done())
    })

    it('returns a user object', (done) => {
      userPromise.then((u) => {
        expect(!!u.email).to.equal(true)
        done()
      })
    })

    it('sends the user a verification email', (done) => {
      emailEvent.then(([err, info, emailOpts]) => {
        if (err) throw err
        expect(emailOpts.to).to.equal(opts.email)
        done()
      })
      .catch(err => done(err))
    })
    it('the verification email has a unique verification link', (done) => {
      emailEvent.then(([err, info, emailOpts]) => {
        if (err) throw err
        expect(/\/verify\?t=[\d\w$!^&_]+/.test(emailOpts.html)).to.equal(true)
        done()
      })
      .catch(err => done(err))
    })
  })
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
