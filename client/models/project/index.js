import ajaxDispatch from 'utils/ajax-dispatch'
import api from 'utils/api'

import CREATE from './create.gql'
import GET from './get.gql'
import GET_ALL from './getAll.gql'
import UPDATE from './update.gql'
import UPDATE_STORYTELLER from './updateStoryteller.gql'

const Project = {
  create: (data) => ajaxDispatch('CREATE_PROJECT', api(CREATE, {data})),
  get: (id) => ajaxDispatch(`PROJECT_${id}`, api(GET, {id})),
  getAll: () => ajaxDispatch('PROJECTS', api(GET_ALL)),
  update: (id, updates) => ajaxDispatch('PROJECT_UPDATE', api(UPDATE, {id, updates})),
  addStoryteller: (args) => this.updateStoryteller({...args, action: 'add'}),
  removeStoryteller: (args) => this.updateStoryteller({...args, action: 'remove'}),
  updateStoryteller: (args) => ajaxDispatch('PROJECT_UPDATE', api(UPDATE_STORYTELLER, args))
}

export default Project
