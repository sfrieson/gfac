import { User, Contact, Nonprofit } from '../models'

import { parseTsv } from '../utils'

export default function (dataType) {
  const {users: contacts, emailList} = getData(dataType)

  return Promise.all(
    // Create each user's NP first
    contacts.map(c => Nonprofit.create({name: c.nonprofit}))
  )
  .then(nonprofits => (
    // Create users for Contacts
    User.bulkCreate(contacts)
    .then(users => (
      Promise.all(
        // preapare Contact object
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

function getData (dataType) {
  if (dataType === 'seed') return parseTsv('contact')
}
