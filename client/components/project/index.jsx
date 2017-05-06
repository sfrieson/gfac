import React, { Component } from 'react'
import { connect } from 'react-redux'
import Project from '../models/Project'

import NewProject from './newProject'


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
          {projects.map((p, i) => <li key={i}>{p.name}</li>)}
        </ul>
      </div>
    )
  }
}

export default connect(stateToProps)(ProjectForm)
export { NewProject }
