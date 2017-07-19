import { expect } from 'chai'
import invite from './invite'

const baseArgs = {link: 'http://verify.me'}

describe('Email: verify', () => {
  it('returns a static and an HTML version', () => {
    const email = invite(baseArgs)
    expect('static' in email).to.equal(true)
    expect('html' in email).to.equal(true)
  })
  it('emails with the supplied verify link', () => {
    const email = invite(baseArgs)
    expect('static' in email).to.equal(true)
    expect(email.html.indexOf(baseArgs.link)).to.be.gt(-1)
  })
})
