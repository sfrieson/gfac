import NewProject from './newProject'

import React, { Component } from 'react'
import { connect } from 'react-redux'
import Project from '../models/Project'
import { FormattedDate } from '../common'


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
        Your Projects:
        <ul>
          {this.renderProjects(projects)}
        </ul>
      </div>
    )
  }

  renderProjects (projects) {
    return projects.map(({date, name}, i) => (
      <li key={i}>
        <FormattedDate raw={date} /> - {name}
      </li>
    ))
  }
}

export default connect(stateToProps)(ProjectForm)
export { NewProject }
