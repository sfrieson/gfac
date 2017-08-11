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
          storytellers {
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
          storytellers {
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
  addStoryteller: function (args) {
    this.updateStoryteller({...args, action: 'add'})
  },
  removeStoryteller: function (args) {
    this.updateStoryteller({...args, action: 'remove'})
  },
  updateStoryteller: function (args) {
    ajaxDispatch('PROJECT_UPDATE',
      api(`mutation UpdateStorytellerToProject ($userId: ID, $projectId: Int, $action: String) {
        updateProjectStoryteller(id: $projectId, storytellerUserId: $userId, action: $action) {
          name
          date
          dateIsApprox
          location
          description
          storytellers {
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
