import React, { Component } from 'react'
import { connect } from 'react-redux'

import { Form } from '../../common'
import { Project } from '../../models'

class ProjectView extends Component {
  constructor (props) {
    super(props)
    this.state = {loading: true}
    this._projects = []
    this.getProject = this.getProject.bind(this)
  }
  componentWillReceiveProps (nextProps) {
    if (this.props.match.params.id !== nextProps.match.params.id) {
      // get new Project?
      this.setState({loading: true})
    }
  }

  render () {
    const { projects = [], projectUpdate, dispatch, match } = this.props
    const project = this.getProject(projects, match.params.id)
    if (!project) return <div>Loading?</div>
    const updates = projectUpdate[match.params.id] || {}

    return (
      <div>
        <h2>Edit Project</h2>
        <Form base={project} changes={updates} changeAction={'PROJECT_UPDATE_' + project.id} onSubmit={(e) => { e.preventDefault(); this.onSubmit(dispatch, project.id, updates) }} />
      </div>
    )
  }

  onSubmit (dispatch, id, updates) {
    Project.update(id, updates)
  }

  getProject (projects, id) {
    if (!this._projects[id]) this._projects[id] = projects.filter((p) => p.id === id)[0]
    return this._projects[id]
  }
}

export default connect(({ projects, projectUpdate }) => ({projects, projectUpdate}))(ProjectView)
