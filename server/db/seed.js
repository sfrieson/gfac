/** Edits made to GSheet Gramforacause_photographers > GFAC Storytellers
  * (in order)
  * Delete column: P(checkbox-1), M(followers)
  * Delete row 168 (Adrianna Blakey, repeated user)
  * Move contest of J168 to L168 (Adrianna Blakey's inpsiration)
  * Delete row 1 (headers)
**/
import fs from 'fs'
import path from 'path'
import models, { Contact, Cause, Nonprofit, Photographer, User } from './models'
import { UserController } from './controllers'
const hashPassword = UserController.hashPassword

const emailList = []

export default function () {
  const raw = './initial_db'

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

  let columns = '_matches|submitted on|name|newsletter|email|instagram|_causes|_rates|camera|portfolio|citystatecountry|_style|_style notes|_paid amount|followers'.split('|')

  const photographers = parseTsv(fs.readFileSync(path.resolve(__dirname, raw, 'photographers.tsv'), 'utf8'), 'photographer')

  columns = 'nonprofit|contactEmail|newsletter|location|matches'.split('|')
  const contacts = parseTsv(fs.readFileSync(path.resolve(__dirname, raw, 'contacts.tsv'), 'utf8'), 'contact')

  return models.sync({force: true})
  .then(() => {
    const causes = 'Adults with Special Needs|Education|Seniors|Career Prep|Health & Fitness|Animals &' +
      ' Environment|Hunger|Children with Special Needs|Disaster Response'

    return Cause.bulkCreate(causes.split('|').map(name => ({name})))
  }).then(() => User.bulkCreate(photographers, {
    include: User.associations.photographers,
    benchmark: true
  }))
  .then(photogs => Promise.all(
    photogs.map((p, i) => Photographer.create(Object.assign({}, photographers[i], {userId: p.id})))
  ))
  .then(() => { console.log('\n\n Photographer created.') })
  .then(() => Promise.all(contacts.map(c => Nonprofit.create({name: c.nonprofit}))))
  .then(nps => (
    User.bulkCreate(contacts).then(users => (
      Promise.all(nps.map((np, i) => Contact.create({nonprofitId: np.id, userId: users[i].id})))
    ))
  ))
  .then(() => { console.log('\n\n Contacts and Nonprofits created.') })
  .then(() => {
    return new Promise(function (resolve, reject) {
      fs.writeFile(
        'email-list.tsv',
        emailList.map(row => row.join('\t')).join('\n'),
        resolve
      )
    })
  })
  .then(() => { console.log('Email list created.') })
  .catch(e => { console.log(e); process.exit(1) })

  function parseTsv (file, role) {
    return file.split('\n') // .slice(0, 10)
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
  }
}

const possible = 'abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ1234567890!$^&_'.split('')
function generatePassword (length) {
  let pass = ''
  while (--length) pass += randomChar()
  return pass
}
function randomChar () { return possible[Math.floor(Math.random() * possible.length)] }
