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
    const mutationVariables = []
    const query = []
    let callVariables = {}

    ;[
      { // Contact Fields
        fields: ['phoneSecondary', 'phoneSecondaryType'],
        mutation: 'updateContactMe(updates: $contactUpdates) { userId }',
        updateFieldName: 'contactUpdates',
        variable: '$contactUpdates: ContactInput'
      },
      { // Photographer Fields
        fields: ['instagram', 'cameraPhone', 'cameraFilm', 'cameraDSLR',
          'cameraOther', 'preferredContactMethod', 'causes'],
        updateFieldName: 'photographerUpdates',
        mutation: 'updatePhotographerMe(updates: $photographerUpdates) { userId }',
        variable: '$photographerUpdates: PhotographerInput'
      },
      { // User Fields
        fields: ['email', 'firstname', 'lastname', 'phone', 'phoneType', 'role'],
        mutation: 'updateMe(updates: $userUpdates) { id }',
        updateFieldName: 'userUpdates',
        variable: '$userUpdates: UserInput'
      }
    ].forEach(info => {
      const changedFields = pick(updates, info.fields)
      callVariables[info.updateFieldName] = changedFields

      if (Object.keys(changedFields).length) {
        mutationVariables.push(info.variable)
        query.push(info.mutation)
      }
    })

    ajaxDispatch('UPDATE_ME',
      api(`mutation UpdateUser(${mutationVariables.join(', ')}) {
        ${query.join('\n')}
      }`, callVariables).then(() => updates) // only return the updated info
    )
  }
}

export default User