import { expect } from 'chai'
import invite from './invite'

const baseArgs = {link: 'http://invitation.com'}

describe('Email: invite', () => {
  it('returns a static and an HTML version', () => {
    const email = invite({...baseArgs, role: 'admin'})
    expect('static' in email).to.equal(true)
    expect('html' in email).to.equal(true)
  })
  it('includes a link in the body', () => {
    const email = invite({...baseArgs, role: 'admin'})
    expect(
      email.html.indexOf(baseArgs.link)
    ).to.be.gt(-1)
  })
  it('Admin version adds admin text', () => {
    const args = {...baseArgs, role: 'admin'}
    const email = invite(args)
    expect(
      email.html.indexOf(`What power!`)
    ).to.be.gt(-1)
  })
  it('Contact version adds contact text', () => {
    const args = {...baseArgs, role: 'contact'}
    const email = invite(args)
    expect(
      email.html.indexOf(`invited to manage`)
    ).to.be.gt(-1)
  })
})
