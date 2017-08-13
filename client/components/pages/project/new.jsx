import React, { Component } from 'react'
import { connect } from 'react-redux'
import { Input } from 'common'
import { Project, Nonprofit } from 'models'

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

    let npOptions
    if (isAdmin) {
      if (!nonprofits) return <div>Loading...</div>
      else {
        npOptions = nonprofits.map(({id, name}) => ({value: id, label: name}))
      }
    }

    return (
      <div>
        <h2>New Project</h2>
        <form onSubmit={this.onSubmit}>

          {isAdmin && <Input label='Nonprofit' type='select' name='nonprofitId' value={form.nonprofitId} options={npOptions} onChange={this.onChange} />}
          {formFields.map((props, key) => <Input key={key} {...props} value={form[props.name]} onChange={this.onChange} />)}

          <button>Submit</button>
        </form>
      </div>
    )
  }
  addDefaults (projectForm) {
    return Object.assign({
      name: '',
      // date: '', // Automatically sets itself (?) TODO is this browser specific?
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
    Project.create(Object.assign(projectForm, {nonprofitId: me.nonprofit.id}))
  }
}
export default connect(stateToProps)(ProjectForm)
