import ajaxDispatch from 'utils/ajax-dispatch'
import api from 'utils/api'

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
          photographers {
            userId
            ... on UserInterface {
              firstname
              lastname
            }
          }
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
          id
          photographers {
            userId
            ... on UserInterface {
              firstname
              lastname
            }
          }
        }
      }`, {id, updates})
    )
  },
  addPhotographer: function (args) {
    ajaxDispatch('PROJECT_UPDATE',
      api(`mutation AddPhotographerToProject ($userId: ID, $projectId: Int) {
        addProjectPhotographer(id: $projectId, photographerUserId: $userId) {
          name
          date
          dateIsApprox
          location
          description
          photographers {
            id
            ... on UserInterface {
              firstname
              lastname
            }
          }
        }
      }`, args)
    )
  }
}

export default Project
