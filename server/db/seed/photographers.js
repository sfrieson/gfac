/** Edits made to GSheet Gramforacause_photographers > GFAC Storytellers
  * (in order)
  * Delete column: P(checkbox-1), M(followers)
  * Delete row 168 (Adrianna Blakey, repeated user)
  * Move contest of J168 to L168 (Adrianna Blakey's inpsiration)
  * Delete row 1 (headers)
**/
import { User, Photographer } from '../models'

import { parseTsv } from '../utils'

export default function (dataType) {
  const {users: photographers, emailList} = getData(dataType)

  return User.bulkCreate(
    photographers,
    {
      benchmark: true
    }
  )
  .then(photogs => Promise.all(
    photogs.map((p, i) => Photographer.create(Object.assign({}, photographers[i], {userId: p.id})))
  ))
  .then(() => { console.log('\n\n Photographers created.') })
  .then(() => emailList)
}

function getData (dataType) {
  if (dataType === 'seed') return parseTsv('photographer')
}
