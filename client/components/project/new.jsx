import React, { Component } from 'react'
import { connect } from 'react-redux'
import { Input } from '../common'
import Project from '../models/Project'

// TODO Set up redirect when form is complete
// TODO Set up sharing of information with the Projects Store when complete
const stateToProps = ({ me, projectForm }) => ({me, projectForm})

class ProjectForm extends Component {
  constructor (props) {
    super(props)
    this.onChange = this.onChange.bind(this, props.dispatch)
    this.onSubmit = this.onSubmit.bind(this)
  }
  render () {
    const { me, projectForm } = this.props
    if (!me.nonprofit) return null
    const {
      name = '',
      date = '',
      dateIsApprox = false,
      description = '',
      location = ''
    } = projectForm

    return (
      <div>
        New Project Form
        <form onSubmit={this.onSubmit}>
          <Input label='Name' type='text' name='name' value={name} onChange={this.onChange} />
          <Input label='Date' type='date' name='date' value={date} onChange={this.onChange} />
          <Input label='Date is approximate' type='checkbox' name='dateIsApprox' value={dateIsApprox} onChange={this.onChange} />
          <Input label='Description' type='textarea' name='description' value={description} onChange={this.onChange} />
          <Input label='Location' type='text' name='location' value={location} onChange={this.onChange} />
          <button>Submit</button>
        </form>
      </div>
    )
  }

  getHidden (me) {
    return {nonprofitId: me.nonprofit.id}
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
    Project.create(Object.assign(this.props.projectForm, this.getHidden(this.props.me)))
  }
}

export default connect(stateToProps)(ProjectForm)
