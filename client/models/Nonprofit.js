import ajaxDispatch from 'utils/ajax-dispatch'
import api from 'utils/api'

const Project = {
  getAll: (fields) => {
    const defaultFields = `
      id
      name
      description
      causes {
        name
      }
      projects {
        name
        date
        dateIsApprox
      }
    `
    ajaxDispatch('NONPROFITS',
      api(`query GetAllNonprofits {
        getNonprofits {
          ${fields || defaultFields}
        }
      }`)
    )
  },
  get: (id) => {
    ajaxDispatch('NONPROFIT',
      api(`query GetNonprofit ($id: ID) {
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
      api(`mutation UpdateNonprofit ($id: ID, $updates: NonprofitInput) {
        updateNonprofit (id: $id, updates: $updates) {
          name
          description
        }
      }`, {id, updates})
    )
  }
}

export default Project
