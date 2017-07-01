import React, { Component } from 'react'
import { connect } from 'react-redux'

import { Form, Input } from 'common'
import { Project, User } from 'models'

const stateToProps = ({ projects, projectUpdate, me }) => ({projects, projectUpdate, me})
class ProjectView extends Component {
  constructor (props) {
    super(props)
    this.state = {loading: true}
    this._projects = []
    Project.get({id: props.match.params.id})
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
    const isAdmin = this.props.me.role === 'admin'
    const {photographers, ...base} = project
    return (
      <div>
        <h2>Edit Project</h2>
        <Form
          base={base}
          changes={updates}
          changeAction={'PROJECT_UPDATE_' + project.id}
          onSubmit={(e) => { e.preventDefault(); this.onSubmit(dispatch, project.id, updates) }}
        />
        {this.renderPhotographers(photographers, project.id, isAdmin)}
        {isAdmin && <AddPhotographer projectId={project.id} />}
      </div>
    )
  }

  onSubmit (dispatch, id, updates) {
    Project.update(id, updates)
  }

  renderPhotographers (photographers, projectId, isAdmin) {
    const photographerList = photographers.length
      ? (
        <ul>
          {photographers.map(p => (
            <li key={p.userId}>
              <form onSubmit={e => { e.preventDefault(); this.removePhotographer(p.userId, projectId) }}>
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
        {photographerList}
      </div>
    )
  }

  removePhotographer (photographerUserId, projectId) {
    Project.removePhotographer({userId: photographerUserId, projectId: projectId})
  }

  getProject (projects, id) {
    if (!this._projects[id]) this._projects[id] = projects.filter((p) => p.id === id)[0]
    return this._projects[id]
  }
}

class AdminPhotographerForm extends Component {
  constructor (props) {
    super(props)
    this.onSubmit = this.onSubmit.bind(this)
    this.onChange = this.onChange.bind(this)
    this.state = {photographerId: ''}
    if (props.me.role === 'admin') {
      if (!props.photographers.length) User.getAllPhotographers()
    }
  }

  render () {
    return (
      <div>
        <h3>Add Photographer</h3>
        <form onSubmit={this.onSubmit}>
          <Input
            name='photographer'
            type='select'
            options={this.props.photographers.map(({userId, firstname, lastname}) => ({label: `${firstname} ${lastname}`, value: userId}))}
            value={this.state.photographerId}
            onChange={this.onChange}
          />
          <button>Add</button>
        </form>
      </div>
    )
  }

  onChange (e) {
    this.setState({photographerId: e.target.value})
  }

  onSubmit (e) {
    e.preventDefault()
    Project.addPhotographer({userId: this.state.photographerId, projectId: this.props.projectId})
  }
}
const AddPhotographer = connect(({me, photographers}) => ({me, photographers}))(AdminPhotographerForm)

export default connect(stateToProps)(ProjectView)
