import { connect } from 'react-redux'

export default connect(({ project, projectUpdate }) => ({project, projectUpdate}))(
  function Project ({ project, projectUpdate, dispatch }) {
    return <div>hi</div>
  }
)
