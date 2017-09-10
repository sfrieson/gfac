import ajaxDispatch from 'utils/ajax-dispatch'
import api from 'utils/api'

const Project = {
  create: (data) => {
    ajaxDispatch('CREATE_PROJECT',
      api(`mutation CreateProject ($update: ProjectCreation){
          createProject (project: $update) {
            name
          }
        }`, {update: data}
      )
    )
  },
  get: (id) => {
    ajaxDispatch(`PROJECT_${id}`,
      api(`query getProject ($id: ID) {
        getProjects(id: $id) {
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
      }`, {id})
    )
  },
  getAll: () => {
    ajaxDispatch('PROJECTS',
      api(`query {
        getProjects {
          name
          date
          id
        }
      }`)
    )
  },
  update: function (id, updates) {
    ajaxDispatch('PROJECT_UPDATE',
      api(`mutation UpdateProject($id: ID, $updates: ProjectUpdates){
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
          id
          storytellers {
            userId
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
