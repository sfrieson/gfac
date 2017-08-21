import pick from 'lodash/pick'

import ajaxDispatch from 'utils/ajax-dispatch'
import api from 'utils/api'

const User = {
  getAllStorytellers: () => (
    ajaxDispatch('ALL_PHOTOGRAPHERS',
      api(`
        query GetAllStorytellers {
          getAllStorytellers {
            userId
            ...on UserInterface{
              firstname
              lastname
            }
          }
        }
      `)
    )
  ),
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
              ... on Storyteller {
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
                  id
                  name
                  description
                }
              }
            }
          }
        `
      ).then(({ data }) => {
        let me = {...data.getMe}
        resolve(me)
        return me
      }))
    })
  },
  getStoryteller: function (userId) {
    ajaxDispatch('STORYTELLER',
      api(`query GetPhotogapher($userId: ID) {
        getStoryteller(userId: $userId) {
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
          projects {
            id
            name
            date
            dateIsApprox
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
      { // Storyteller Fields
        fields: ['instagram', 'cameraPhone', 'cameraFilm', 'cameraDSLR',
          'cameraOther', 'preferredContactMethod', 'causes', 'availabilities'],
        updateFieldName: 'storytellerUpdates',
        mutation: 'updateStorytellerMe(updates: $storytellerUpdates) { userId }',
        variable: '$storytellerUpdates: StorytellerInput'
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
