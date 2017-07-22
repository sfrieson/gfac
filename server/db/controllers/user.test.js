import { expect } from 'chai'

import emitter from 'emitter'

import Nonprofit from './nonprofit'
import User from './user'

describe('Controller: User', () => {
  describe('creation flow', () => {
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
    before(() => {
      emailEvent = new Promise((resolve) => {
        emitter.once('email', function () { resolve(arguments) })
      })
    })

    after((done) => {
      User.getInstance({email: opts.email})
      .then(u => u.destroy({force: true}))
      .then(() => done())
    })

    describe('#create', () => {
      before((done) => {
        userPromise = User.create(opts)
        .then((u) => { done(); return u })
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
    describe('#verify', () => {
      it('confirms the user\'s email address', (done) => {
        emailEvent.then(([_, __, emailOpts]) => emailOpts.html)
        .then(html => html.match(/href="([^"]*)"/)[1])
        .then(link => link.match(/t=([^]*)/)[1])
        .then(token => User.verify(token))
        .then(u => u.get({plain: true}))
        .then(u => {
          expect(u.emailConfirmed).to.equal(true)
          expect(u.loginToken).to.equal('')
          expect(u.tokenExpires).to.equal(0)
          done()
        })
        .catch(err => done(err))
      })
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

    it('sends the correct message content', (done) => {
      emailEvent.then(([err, info, emailOpts]) => {
        if (err) throw err
        expect(emailOpts.html.indexOf('What power!')).to.be.gt(-1)
        done()
      })
      .catch(err => done(err))
    })

    it('creates an admin-specific signup link', (done) => {
      emailEvent.then(([err, info, emailOpts]) => {
        if (err) throw err
        expect(emailOpts.html.indexOf('/admin-invite')).to.be.gt(-1)
        done()
      })
      .catch(err => done(err))
    })
  })

  describe('#inviteContact', () => {
    const opts = {
      firstname: 'Connie',
      lastname: 'Contact',
      email: 'connie@ngo.org'
    }
    let np, emailEvent

    before(done => {
      emailEvent = new Promise((resolve) => {
        emitter.once('email', function () { resolve(arguments) })
      })

      Nonprofit.getAll()
      .then(nps => { np = nps[0]; return nps[0] })
      .then(np => User.inviteContact(opts, np.id))
      .then((opts) => done())
      .catch(err => done(err))
    })

    after((done) => {
      User.getInstance({email: opts.email})
      .then(u => u.destroy())
      .then(() => done())
      .catch(err => done(err))
    })

    it('creates a base account', (done) => {
      User.get({email: opts.email})
      .then(u => {
        expect(Object.keys(u).length).to.be.gt(0)
        done()
      })
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

    it('sends the correct message content', (done) => {
      emailEvent.then(([err, info, emailOpts]) => {
        if (err) throw err
        expect(emailOpts.html.indexOf('manage')).to.be.gt(-1)
        done()
      })
      .catch(err => done(err))
    })
    it('includes the nonprofit\'s name in the message content', (done) => {
      emailEvent.then(([err, info, emailOpts]) => {
        if (err) throw err
        console.log('np name', np.name)
        expect(emailOpts.html.indexOf(np.name)).to.be.gt(-1)
        done()
      })
      .catch(err => done(err))
    })

    it('creates an client-specific signup link', (done) => {
      emailEvent.then(([err, info, emailOpts]) => {
        if (err) throw err
        expect(emailOpts.html.indexOf('/nonprofit-invite')).to.be.gt(-1)
        done()
      })
      .catch(err => done(err))
    })
  })
})
