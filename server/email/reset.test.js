import { expect } from 'chai'
import reset from './reset'

const args = {link: 'http://success.com'}
const email = reset(args)

describe('Email: reset', () => {
  it('returns a static and an HTML version', () => {
    expect('static' in email).to.equal(true)
    expect('html' in email).to.equal(true)
  })
  describe('HTML version', () => {
    it('takes and link opt and puts it in the a tag\'s href', () => {
      expect(
        email.html.indexOf(`<a href="${args.link}">`)
      ).to.be.gt(-1)
    })
    it('takes and link opt and displays it at the bottom as text', () => {
      expect(
        email.html.indexOf(`<p>${args.link}</p>`)
      ).to.be.gt(-1)
    })
  })
})
