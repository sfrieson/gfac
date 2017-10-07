import pick from 'lodash/pick'

import ajaxDispatch from 'utils/ajax-dispatch'
import api from 'utils/api'

import GET_ME from './getMe.gql'
import GET_STORYTELLER from './getStoryteller.gql'
import GET_ALL_STORYTELLERS from './getAllStorytellers.gql'

const User = {
  getAllStorytellers: () => ajaxDispatch('ALL_PHOTOGRAPHERS', api(GET_ALL_STORYTELLERS)),
  getMe: () => {
    return new Promise((resolve) => {
      ajaxDispatch('ME',
        api(GET_ME).then(({ data: { getMe: me } }) => {
          resolve(me)
          return me
        })
      )
    })
  },
  getStoryteller: (userId) => ajaxDispatch('STORYTELLER', api(GET_STORYTELLER, {userId})),
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
