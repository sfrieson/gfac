import ajaxDispatch from 'utils/ajax-dispatch'
import api from 'utils/api'

import GET from './get.gql'
import GET_ALL_DEFAULT from './getAllDefault.gql'
import UPDATE from './update.gql'

const Project = {
  getAll: (fields) => {
    const query = fields
    ? `query GetAllNonprofits {
      getNonprofits {
        ${fields}
      }
    }`
    : GET_ALL_DEFAULT

    ajaxDispatch('NONPROFITS', api(query))
  },
  get: (id) => ajaxDispatch('NONPROFIT', api(GET, {id})),
  update: (id, updates) => ajaxDispatch('NONPROFIT_UPDATE', api(UPDATE, {id, updates}))
}

export default Project
