import { expect } from 'chai'
import invite from './invite'

const baseArgs = {link: 'http://invitation.com'}

describe('Email: invite', () => {
  it('returns a static and an HTML version')
  it('includes a link in the body', () => {
    const email = invite({...baseArgs, role: 'admin'})
    expect(
      email.html.indexOf(baseArgs.link)
    ).to.be.gt(-1)
  })
})
