import ajaxDispatch from '../utils/ajax-dispatch'
import api from '../utils/api'

const Project = {
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
