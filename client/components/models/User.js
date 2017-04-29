import { pick } from 'lodash'

import ajaxDispatch from '../utils/ajax-dispatch'
import api from '../utils/api'

const User = {
  getMe: () => {
    ajaxDispatch('ME',
      api(`query GetMe {
          getMe {
            email
            firstname
            lastname
            phone
            phoneType
            role
          }
          getMePhotographer {
            instagram
            cameraPhone
            cameraFilm
            cameraDSLR
            cameraOther
            preferredContactMethod
            causes {
              id
            }
          }
          getMeContact {
            phoneSecondary
            phoneSecondaryType
          }
        }`
      ).then(({ data }) => {
        let me = {...data.getMe}
        if (me.role === 'photographer') me = {...me, ...data.getMePhotographer, causes: data.getMePhotographer.causes.map(({id}) => id)}
        if (me.role === 'contact') me = {...me, ...data.getMeContact}

        return me
      })
    )
  },
  updateMe: (updates) => {
    let call = {query: '', variables: {}}

    call = contactUpdates(call, updates)
    call = photographerUpdates(call, updates)
    call = userUpdates(call, updates)

    ajaxDispatch('UPDATE_ME',
      api(`mutation UpdateUser(
        $userUpdates: UserInput,
        $photographerUpdates: PhotographerInput,
        $contactUpdates: ContactInput
      ) {
        ${call.query}
      }`, {...call.variables}).then(() => updates) // only return the updated info
    )
  }
}

export default User

function userUpdates (call, updates) {
  const mutation = 'updateMe(updates: $userUpdates) { id }'
  const variables = pick(updates, ['email', 'firstname', 'lastname', 'phone', 'phoneType', 'role'])
  if (Object.keys(variables).length) {
    call.variables = {...call.variables, userUpdates: variables}
    call.query += mutation
  }

  return call
}

function photographerUpdates (call, updates) {
  const mutation = 'updateMe(updates: $photographerUpdates) { userId }'
  const variables = pick(updates, [
    'instagram',
    'cameraPhone',
    'cameraFilm',
    'cameraDSLR',
    'cameraOther',
    'preferredContactMethod',
    'causes'
  ])

  if (Object.keys(variables).length) {
    call.variables = {...call.variables, photographerUpdates: variables}
    call.query += mutation
  }

  return call
}

function contactUpdates (call, updates) {
  const mutation = 'updateMe(updates: $contactUpdates) { userId }'
  const variables = pick(updates, ['phoneSecondary', 'phoneSecondaryType'])

  if (Object.keys(variables).length) {
    call.variables = {...call.variables, ...variables}
    call.query += mutation
  }
  if (Object.keys(variables).length) {
    call.variables = {...call.variables, contactUpdates: variables}
    call.query += mutation
  }

  return call
}
