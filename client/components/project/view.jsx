import React from 'react'
import { connect } from 'react-redux'

import { Form } from '../common'
import { Project } from '../models'

export default connect(({ project, projectUpdate }) => ({project, projectUpdate}))(
  function ProjectView ({ project, projectUpdate, dispatch }) {
    return <div>
      <h2>Edit Project</h2>
      <Form changeType='PROJECT_UPDATE' onSubmit={onSubmit} />
    </div>

    function onSubmit (e) {
      e.preventDefault()
      Project.update(project.id, projectUpdate)
    }
  }
)
