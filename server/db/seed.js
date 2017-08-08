import fs from 'fs'

import models, {Photographer, Project} from './models'

import seedCauses from './seed/causes'
import seedPhotographers from './seed/photographers'
import seedContacts from './seed/contacts'

let emailList = []

export default function (dataType) {
  if (dataType === 'causes') return models.sync({force: false}).then(seedCauses)
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
    return Promise.all([
      Photographer.find(),
      Project.find()
    ]).then(([photographer, project]) => photographer.addProject(project))
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
  .then(() => { process.exit() })
  .catch(e => { console.log(e); process.exit(1) })
}
