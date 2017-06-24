import fs from 'fs'

import models from './models'

import seedCauses from './seed/causes'
import seedPhotographers from './seed/photographers'
import seedContacts from './seed/contacts'

let emailList = []

export default function (dataType) {
  return models.sync({force: true})
  .then(seedCauses)
  .then(() => seedPhotographers(dataType))
  .then(photographerEmails => {
    emailList = emailList.concat(photographerEmails)
  })
  .then(() => seedContacts(dataType))
  .then(contactEmails => {
    emailList = emailList.concat(contactEmails)
  })
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
}
