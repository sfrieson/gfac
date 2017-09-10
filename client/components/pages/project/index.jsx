import NewProject from './new'
import ViewProject from './view'

import React, { Component } from 'react'
import { connect } from 'react-redux'
import { Project } from 'models'
import { FormattedDate } from 'common'
import { Link } from 'react-router-dom'

const stateToProps = ({ me, projects }) => ({me, projects: projects.all})

class ProjectList extends Component {
  constructor (props) {
    super(props)
    Project.getAll()
  }
  render () {
    const projects = this.props.projects || []

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

export default connect(stateToProps)(ProjectList)
export { NewProject, ViewProject }
