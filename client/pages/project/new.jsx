import React, { Component } from 'react'
import { connect } from 'react-redux'
import Input from 'components/Input'

import Nonprofit from 'models/nonprofit'
import Project from 'models/project'

import config from 'client-config'
const { fields, fieldsets: { createProject } } = config
const formFields = createProject.map(name => fields[name])

// TODO Set up redirect when form is complete
// TODO Set up sharing of information with the Projects Store when complete
const stateToProps = ({ me, projectForm, nonprofits }) => ({me, projectForm, nonprofits})

class ProjectForm extends Component {
  constructor (props) {
    super(props)
    this.onChange = this.onChange.bind(this, props.dispatch)
    this.onSubmit = this.onSubmit.bind(this)

    if (props.me.role === 'admin') {
      if (!props.nonprofits.length || !('id' in props.nonprofits[0]) || !('name' in props.nonprofits[0])) {
        Nonprofit.getAll(`
          id
          name
        `)
      }
    }
  }
  render () {
    const {nonprofits, projectForm, me} = this.props
    const form = this.addDefaults(projectForm)
    const isAdmin = me.role === 'admin'

    let nonprofitOptions
    if (isAdmin) {
      if (!nonprofits) return <div>Loading...</div>
      else {
        nonprofitOptions = nonprofits.map(({id, name}) => ({value: id, label: name}))
      }
    }

    return (
      <div>
        <h2>New Project</h2>
        <form onSubmit={this.onSubmit}>

          {isAdmin && <Input label='Nonprofit' type='select' name='nonprofitId' value={form.nonprofitId} options={nonprofitOptions} onChange={this.onChange} />}
          {formFields.map((props, key) => <Input key={key} {...props} value={form[props.name]} onChange={this.onChange} />)}

          <button>Submit</button>
        </form>
      </div>
    )
  }
  addDefaults (projectForm) {
    return Object.assign({
      name: '',
      dateIsApprox: false,
      description: '',
      location: '',
      nonprofitId: '' // Admin-only
    }, projectForm)
  }
  onChange (dispatch, e) {
    const payload = {}
    payload[e.target.name] = e.target.value
    dispatch({
      type: 'PROJECT_FORM_CHANGE',
      change: payload
    })
  }
  onSubmit (e) {
    e.preventDefault()
    const {projectForm, me} = this.props
    const data = 'nonprofitId' in projectForm
      ? this.addDefaults(projectForm)
      : this.addDefaults(Object.assign(projectForm, {nonprofitId: me.nonprofit.id}))
    Project.create(data)
  }
}
export default connect(stateToProps)(ProjectForm)
