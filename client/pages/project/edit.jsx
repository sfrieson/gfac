import React, { Component } from 'react'
import { connect } from 'react-redux'

import Form from 'components/Form'
import Input from 'components/Input'

import Project from 'models/project'
import User from 'models/user'

import config from 'client-config'
const { fieldsets: { editProject } } = config

const stateToProps = ({ projects, projectUpdate, me }, {match}) => {
  return {
    projectUpdate,
    me,
    project: projects[match.params.id]
  }
}

class ProjectView extends Component {
  constructor (props) {
    super(props)
    this.state = {loading: true}
    this._projects = []
    Project.get(props.match.params.id)
  }

  componentWillReceiveProps (nextProps) {
    if (this.props.match.params.id !== nextProps.match.params.id) {
      // get new Project?
      this.setState({loading: true})
    }
  }

  render () {
    const { project, projectUpdate, dispatch, match } = this.props
    if (!project) return <div>Loading?</div>
    const updates = projectUpdate[match.params.id] || {}
    const isAdmin = this.props.me.role === 'admin'
    const {storytellers, ...base} = project
    return (
      <div>
        <h2>Edit Project</h2>
        <Form
          fields={editProject}
          base={base}
          changes={updates}
          changeAction={'PROJECT_UPDATE_' + project.id}
          onSubmit={(e) => { e.preventDefault(); this.onSubmit(dispatch, project.id, updates) }}
        />
        {this.renderStorytellers(storytellers, project.id, isAdmin)}
        {isAdmin && <AddStoryteller projectId={project.id} />}
      </div>
    )
  }

  onSubmit (dispatch, id, updates) {
    Project.update(id, updates)
  }

  renderStorytellers (storytellers, projectId, isAdmin) {
    const storytellerList = storytellers.length
      ? (
        <ul>
          {storytellers.map(p => (
            <li key={p.userId}>
              <form onSubmit={e => { e.preventDefault(); this.removeStoryteller(p.userId, projectId) }}>
                {p.firstname} {p.lastname} {isAdmin && <button>Remove</button>}
              </form>
            </li>
          ))}
        </ul>
      ) : (
        <div><em>No storytellers yet...</em></div>
      )
    return (
      <div>
        <h3>Storytellers</h3>
        {storytellerList}
      </div>
    )
  }

  removeStoryteller (storytellerUserId, projectId) {
    Project.removeStoryteller({userId: storytellerUserId, projectId: projectId})
  }
}

class AdminStorytellerForm extends Component {
  constructor (props) {
    super(props)
    this.onSubmit = this.onSubmit.bind(this)
    this.onChange = this.onChange.bind(this)
    this.state = {storytellerId: ''}
    if (props.me.role === 'admin') {
      if (!props.storytellers.length) User.getAllStorytellers()
    }
  }

  render () {
    return (
      <div>
        <h3>Add Storyteller</h3>
        <form onSubmit={this.onSubmit}>
          <Input
            name='storyteller'
            type='select'
            options={this.props.storytellers.map(({userId, firstname, lastname}) => ({label: `${firstname} ${lastname}`, value: userId}))}
            value={this.state.storytellerId}
            onChange={this.onChange}
          />
          <button>Add</button>
        </form>
      </div>
    )
  }

  onChange (e) {
    this.setState({storytellerId: e.target.value})
  }

  onSubmit (e) {
    e.preventDefault()
    Project.addStoryteller({userId: this.state.storytellerId, projectId: this.props.projectId})
  }
}
const AddStoryteller = connect(({me, storytellers}) => ({me, storytellers}))(AdminStorytellerForm)

export default connect(stateToProps)(ProjectView)
