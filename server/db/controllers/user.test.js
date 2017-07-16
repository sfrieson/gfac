import { expect } from 'chai'

// import emitter from 'emitter'
import User from './user'

describe('Controller: User', () => {
  describe('#inviteAdmin', () => {
    let res
    const opts = {
      firstname: 'Ally',
      lastname: 'Admin',
      email: 'admin@me.com'
    }

    before((done) => {
      res = User.inviteAdmin(opts)
      .then((opts) => { done(); return opts })
    })

    after((done) => {
      User.getInstance({email: opts.email})
      .then(u => u.destroy())
      .then(() => done())
    })

    it('creates a customized link', (done) => {
      res.then(opts => {
        expect(opts.link.indexOf('t=')).to.be.gt(-1)
        done()
      })
    })
    it('creates a base account')
  })
})
