/** Edits made to GSheet Gramforacause_storytellers > GFAC Storytellers
  * (in order)
  * Delete column: P(checkbox-1), M(followers)
  * Delete row 168 (Adrianna Blakey, repeated user)
  * Move contest of J168 to L168 (Adrianna Blakey's inpsiration)
  * Delete row 1 (headers)
**/
import { User, Storyteller } from '../models'

import { parseTsv } from '../utils'

export default function (dataType) {
  const {users: storytellers, emailList} = getData(dataType)

  return User.bulkCreate(storytellers)
  .then(users => Promise.all(
    users.map((u, i) => {
      const storyteller = Object.assign({causes: []}, storytellers[i], {userId: u.id})

      return Storyteller.create(
        storyteller,
        {include: [Storyteller.associations.availabilities]}
      )
      .then(p => p.setCauses(storyteller.causes))
    })
  ))
  .then(() => { console.log('\n\n Storytellers created.') })
  .then(() => emailList)
}

function getData (dataType) {
  if (dataType === 'seed') return parseTsv('storyteller')
  else {
    const { Storyteller: Mock } = require('./mocks')
    const storytellers = Mock(20)

    return {
      users: storytellers,
      emailList: storytellers.map(p => [p.email, p.firstname, p.lastname, p.password])
    }
  }
}
