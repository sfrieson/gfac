import ajaxDispatch from '../utils/ajax-dispatch'
import api from '../utils/api'

const Project = {
  create: (d) => {
    ajaxDispatch('CREATE_PROJECT',
      api(`mutation CreateProject ($update: ProjectInput){
          createProject (project: $update) {
            name
          }
        }`, {update: d}
      )
    )
  },
  get: (me) => {
    const userTypeSpecificQuery = {}
    let callArgs
    let queryArgs
    if (me.role === 'contact') {
      userTypeSpecificQuery.nonprofitId = me.nonprofit.id
      queryArgs = '$nonprofitId: String'
      callArgs = 'nonprofitId: $nonprofitId'
    } else if (me.role === 'photographer') {
      userTypeSpecificQuery.photographerUserId = me.id
      queryArgs = '$photographerUserId: String'
      callArgs = 'photographerUserId: $photographerUserId'
    }
    ajaxDispatch('PROJECTS',
      api(`query (${queryArgs}){
        getProjects (${callArgs}) {
          name
          date
          dateIsApprox
          location
          description
          id
        }
      }`, userTypeSpecificQuery)
    )
  },
  update: function (id, updates) {
    // TODO change id to Int when Model changes
    ajaxDispatch('PROJECT_UPDATE',
      api(`mutation UpdateProject($id: String, $updates: ProjectInput){
        updateProject (id: $id, updates: $updates) {
          name
          date
          dateIsApprox
          location
          description
        }
      }`, {id, updates})
    )
  }
}

export default Project
