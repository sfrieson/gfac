import { pick } from 'lodash'

import ajaxDispatch from 'utils/ajax-dispatch'
import api from 'utils/api'

const User = {
  getMe: () => {
    return new Promise((resolve) => {
      ajaxDispatch('ME',
        api(`
          query GetMe {
            getMe {
              email
              firstname
              lastname
              phone
              phoneType
              role
              ... on Photographer {
                instagram
                cameraPhone
                cameraFilm
                cameraDSLR
                cameraOther
                preferredContactMethod
                causes {
                  name
                }
                availabilities
              }
              ... on Contact {
                phoneSecondary
                phoneSecondaryType
                nonprofit {
                  name
                  description
                }
              }
            }
          }
        `
      ).then(({ data }) => {
        let me = {...data.getMe}
        // if (me.role === 'photographer') me = {...me, ...data.getMePhotographer, causes: data.getMePhotographer.causes.map(({id}) => id)}
        // if (me.role === 'contact') me = {...me, ...data.getMeContact}
        resolve(me)
        return me
      }))
    })
  },
  getStoryteller: function (userId) {
    ajaxDispatch('STORYTELLER',
      api(`query GetPhotogapher ($userId: String) {
        getPhotographer (userId: $userId) {
          firstname
          lastname
          email
          instagram
          phone
          phoneType
          preferredContactMethod
          portfolio
          causes {
            name
          }
          availabilities
        }
      }`, {userId})
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
          'cameraOther', 'preferredContactMethod', 'causes', 'availabilities'],
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
