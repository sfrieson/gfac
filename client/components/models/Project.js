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
  get: () => {
    ajaxDispatch('PROJECTS',
      api(`query {
        getProjects {
          name
          date
          dateIsApprox
          location
          description
          id
        }
      }`)
    )
  },
  update: function (id, updates) {
    ajaxDispatch('PROJECT_UPDATE',
      api(`mutation UpdateProject($id: Int, $updates: ProjectInput){
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
