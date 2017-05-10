/** Edits made to GSheet Gramforacause_photographers > GFAC Storytellers
  * (in order)
  * Delete column: P(checkbox-1), M(followers)
  * Delete row 168 (Adrianna Blakey, repeated user)
  * Move contest of J168 to L168 (Adrianna Blakey's inpsiration)
  * Delete row 1 (headers)
**/
import fs from 'fs'
import path from 'path'
import models, { Cause, Photographer, User } from './server/db/models'

const raw = './initial_db'
// const parsed = './parsed_db'

const cameraTypes = {
  'Phone + DSLR': {cameraPhone: true, cameraDSLR: true},
  DSLR: {cameraDSLR: true},
  Phone: {cameraPhone: true},
  'Phone & DSLR': {cameraPhone: true, cameraDSLR: true},
  Film: {cameraFilm: true},
  'All of the above': {cameraPhone: true, cameraDSLR: true, cameraFilm: true}
}
const column = '_matches|submitted on|name|newsletter|email|instagram|_causes|_rates|camera|portfolio|citystatecountry|_style|_style notes|_paid amount|followers'.split('|')

const parse = {
  'submitted on': (d) => ({submitted: new Date(d.slice(0, 9))}),
  name: (n) => {
    const [, firstname, lastname] = n.match(/(.*?) ([^ ]*)$/)
    return {firstname, lastname}
  },
  newsletter: (d) => ({newsletter: !!d}),
  email: (d) => ({email: d}),
  instagram: (d) => ({instagram: d.replace(/@|https?:\/\/|www\.|instagram\.com\/\/?/g, '').match(/^([\w_.-]*)/)[0]}),
  camera: (d) => cameraTypes[d],
  portfolio: (d) => ({portfolio: d}),
  citystatecountry: (d) => ({citystatecountry: d}),
  followers: (d) => ({followers: +d.replace(/,/, '')})
}

const photographers = fs.readFileSync(path.resolve(__dirname, raw, 'photographers.tsv'), 'utf8')
.split('\n') // .slice(0, 10)
.map(photog => {
  return photog.split('\t')
  .reduce((p, val, i) => {
    const col = column[i]
    if (col[0] !== '_') Object.assign(p, parse[col](val))
    return p
  }, {role: 'photographer'})
})

models.sync({force: true})
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
.then(() => { console.log('\n\n completed'); process.exit() })
.catch(e => { console.log(e); process.exit(1) })
