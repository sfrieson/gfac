import ajaxDispatch from 'utils/ajax-dispatch'
import api from 'utils/api'

const Project = {
  get: (id) => {
    ajaxDispatch('NONPROFIT',
      api(`query GetNonprofit ($id: String) {
        getNonprofit (id: $id) {
          name
          description
          contacts {
            phoneSecondary
          }
          causes {
            name
          }
          projects {
            name
            date
            dateIsApprox
          }
        }
      }`, {id})
    )
  },
  update: (id, updates) => {
    ajaxDispatch('NONPROFIT_UPDATE',
      api(`mutation UpdateNonprofit ($id: String, $updates: NonprofitInput) {
        updateNonprofit (id: $id, updates: $updates) {
          name
          description
        }
      }`, {id, updates})
    )
  }
}

export default Project
