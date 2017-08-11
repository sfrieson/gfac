import fs from 'fs'

import models, {Storyteller, Project} from '../models'

import seedCauses from '../seed/causes'
import seedStorytellers from '../seed/storytellers'
import seedContacts from '../seed/contacts'

let emailList = []

module.exports = function (dataType) {
  if (dataType === 'causes') return models.sync({force: false}).then(seedCauses)
  return models.sync({force: true})
  .then(seedCauses)
  .then(() => seedStorytellers(dataType))
  .then(storytellerEmails => {
    emailList = emailList.concat(storytellerEmails)
  })
  .then(() => seedContacts(dataType))
  .then(contactEmails => {
    emailList = emailList.concat(contactEmails)
  })
  .then(() => {
    return Promise.all([
      Storyteller.find(),
      Project.find()
    ]).then(([storyteller, project]) => storyteller.addProject(project))
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
