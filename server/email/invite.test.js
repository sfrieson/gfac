import { expect } from 'chai'
import invite from './invite'

const baseArgs = {link: 'http://invitation.com'}

describe('Email: invite', () => {
  it('returns a static and an HTML version', () => {
    const email = invite({...baseArgs, role: 'admin'})
    expect('static' in email).to.equal(true)
    expect('html' in email).to.equal(true)
  })
  describe('Admin version', () => {
    const args = {...baseArgs, role: 'admin'}
    const email = invite(args)
    it('adds specific admin text', () => {
      expect(
        email.html.indexOf(`What power!`)
      ).to.be.gt(-1)
    })
    it('has a link to an admin only signup form')
  })
  describe('Contact version', () => {
    const args = {...baseArgs, role: 'contact'}
    const email = invite(args)
    it('adds specific contact text', () => {
      expect(
        email.html.indexOf(`organization`)
      ).to.be.gt(-1)
    })
    it('tells which organization invited them')
    it('has a link to account creation with organization info')
  })
  describe('Storyteller version', () => {
    const args = {...baseArgs, role: 'storyteller'}
    const email = invite(args)
    it('adds specific storyteller text', () => {
      expect(
        email.html.indexOf(`Storyteller`)
      ).to.be.gt(-1)
    })
    it('has a link to account creation with storyteller info')
  })
})
