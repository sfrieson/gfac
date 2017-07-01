/** Edits made to GSheet Gramforacause_photographers > GFAC Storytellers
  * (in order)
  * Delete column: P(checkbox-1), M(followers)
  * Delete row 168 (Adrianna Blakey, repeated user)
  * Move contest of J168 to L168 (Adrianna Blakey's inpsiration)
  * Delete row 1 (headers)
**/
import { User, Photographer } from '../models'
import { Photographer as Mock } from './mocks'

import { parseTsv } from '../utils'

export default function (dataType) {
  const {users: photographers, emailList} = getData(dataType)

  return User.bulkCreate(photographers)
  .then(users => Promise.all(
    users.map((u, i) => {
      const photographer = Object.assign({causes: []}, photographers[i], {userId: u.id})

      return Photographer.create(
        photographer,
        {include: [Photographer.associations.availabilities]}
      )
      .then(p => p.setCauses(photographer.causes))
    })
  ))
  .then(() => { console.log('\n\n Photographers created.') })
  .then(() => emailList)
}

function getData (dataType) {
  if (dataType === 'seed') return parseTsv('photographer')

  const photographers = Mock(20)

  return {
    users: photographers,
    emailList: photographers.map(p => [p.email, p.firstname, p.lastname, p.password])
  }
}
