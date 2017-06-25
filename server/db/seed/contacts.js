import { User, Contact, Nonprofit } from '../models'
import { Contact as Mock } from './mocks'

import { parseTsv } from '../utils'

export default function (dataType) {
  const data = getData(dataType)

  if (dataType === 'seed') return dataSeed(data)
  if (dataType === 'mocks') return mockSeed(data)
}

function dataSeed ({users: contacts, emailList}) {
  return Promise.all(
    // Create each user's NP first
    contacts.map(c => Nonprofit.create({name: c.nonprofit}))
  )
  .then(nonprofits => (
    // Create users for Contacts
    User.bulkCreate(contacts)
    .then(users => (
      Promise.all(
        // prepare Contact object
        nonprofits
        .map(
          (np, i) => ({nonprofitId: np.id, userId: users[i].id})
        )
        .map(contact => Contact.create(contact))
      )
    ))
  ))
  .then(() => { console.log('\n\n Contacts and Nonprofits created.') })
  .then(() => emailList)
}

function mockSeed ({users: contacts, emailList, nonprofits}) {
  console.log('in contacts seed')
  return Promise.all(
    nonprofits.map(nonprofit => (
       Nonprofit.create(nonprofit, {include: [Nonprofit.associations.projects]})
       .then(np => np.setCauses(nonprofit.causes).then(() => np))
    ))
  )

  .then(nps => {
    console.log('nps created. creating users')
    return User.bulkCreate(contacts)
    .then(users => ({nps, users}))
  })
  .then(({nps, users}) => {
    console.log('users created. forming contacts')
    const npsLen = nps.length
    return contacts.map(
      (c, i) => Object.assign(c, {nonprofitId: nps[i % npsLen].id, userId: users[i].id})
    )
  })
  .then(contacts => Contact.bulkCreate(contacts))
  .then(() => { console.log('\n\n Contacts and Nonprofits created.') })
  .then(() => emailList)
}

function getData (dataType) {
  if (dataType === 'seed') return parseTsv('contact')

  const {contacts, nonprofits} = Mock(20)

  return {
    nonprofits,
    users: contacts,
    emailList: contacts.map(c => ([c.email, c.firstname, c.lastname, c.password]))
  }
}
