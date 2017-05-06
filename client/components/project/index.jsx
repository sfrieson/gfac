import NewProject from './newProject'

import React, { Component } from 'react'
import { connect } from 'react-redux'
import Project from '../models/Project'
import { FormattedDate } from '../common'
import { Link } from 'react-router-dom'


const stateToProps = ({ me, projects }) => ({me, projects})

class ProjectForm extends Component {
  constructor (props) {
    super(props)
    Project.get(props.me)
  }
  render () {
    const { projects = [] } = this.props

    return (
      <div>
        Your Projects ({projects.length}):
        <ul>
          {this.renderProjects(projects)}
        </ul>
      </div>
    )
  }

  renderProjects (projects) {
    return projects.map(({date, id, name}, i) => (
      <li key={id}>
        <Link to={`/project/${id}`}>
          <FormattedDate raw={date} /> - {name}
        </Link>
      </li>
    ))
  }
}

export default connect(stateToProps)(ProjectForm)
export { NewProject }
