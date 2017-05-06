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
  }
}

export default Project
