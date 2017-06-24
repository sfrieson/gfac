import fs from 'fs'
import path from 'path'

import { UserController } from './controllers'

const possible = 'abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ1234567890!$^&_'.split('')
export function generatePassword (length) {
  let pass = ''
  while (--length) pass += randomChar()
  return pass
}
function randomChar () { return possible[Math.floor(Math.random() * possible.length)] }

// parseTsv info
const hashPassword = UserController.hashPassword
const cameraTypes = {
  'Phone + DSLR': {cameraPhone: true, cameraDSLR: true},
  DSLR: {cameraDSLR: true},
  Phone: {cameraPhone: true},
  'Phone & DSLR': {cameraPhone: true, cameraDSLR: true},
  Film: {cameraFilm: true},
  'All of the above': {cameraPhone: true, cameraDSLR: true, cameraFilm: true}
}

const parse = {
  contactEmail: (d) => ({email: d, firstname: d.split('@')[0], lastname: '  '}),
  'submitted on': (d) => ({submitted: new Date(d.slice(0, 9))}),
  name: (n) => {
    const [, firstname, lastname] = n.match(/(.*?) ([^ ]*)$/)
    return {firstname, lastname}
  },
  location: (d) => ({location: d}),
  matches: (d) => ({matches: d}),
  newsletter: (d) => ({newsletter: !!d}),
  nonprofit: (d) => ({nonprofit: d}),
  email: (d) => ({email: d}),
  instagram: (d) => ({instagram: d.replace(/@|https?:\/\/|www\.|instagram\.com\/\/?/g, '').match(/^([\w_.-]*)/)[0]}),
  camera: (d) => cameraTypes[d],
  portfolio: (d) => ({portfolio: d}),
  citystatecountry: (d) => ({citystatecountry: d}),
  followers: (d) => ({followers: +d.replace(/,/, '')})
}

const photographerColumns = '_matches|submitted on|name|newsletter|email|instagram|_causes|_rates|camera|portfolio|citystatecountry|_style|_style notes|_paid amount|followers'.split('|')

const contactColumns = 'nonprofit|contactEmail|newsletter|location|matches'.split('|')

export function parseTsv (role) {
  const emailList = []

  let columns
  let filename
  if (role === 'photographer') {
    columns = photographerColumns
    filename = 'photographers.tsv'
  }
  if (role === 'contact') {
    columns = contactColumns
    filename = 'contacts.tsv'
  }

  const users = fs.readFileSync(path.resolve(__dirname, './initial_db', filename), 'utf8')
  .split('\n') // .slice(0, 10)
  .map(row => {
    var user = row.split('\t')
    .reduce((p, val, i) => {
      const col = columns[i]
      if (col[0] !== '_') Object.assign(p, parse[col](val))
      return p
    }, {role: role})

    const pass = generatePassword(13)
    user.hashPassword = hashPassword(pass)
    emailList.push([user.email, user.firstname, user.lastname, pass])
    return user
  })

  return {users, emailList}
}
