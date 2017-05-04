import React from 'react'
import { connect } from 'react-redux'
import { Input } from '../common'

const stateToProps = ({ me, projectForm }) => ({me, projectForm})

export default connect(stateToProps)(function ProjectForm ({ me, projectForm, dispatch }) {
  console.log(me)
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
      <form>
        <Input label='Name' type='text' name='name' value={name} onChange={onChange} />
        <Input label='Date' type='date' name='date' value={date} onChange={onChange} />
        <Input label='Date is approximate' type='checkbox' name='dateIsApprox' value={dateIsApprox} onChange={onChange} />
        <Input label='Description' type='textarea' name='description' value={description} onChange={onChange} />
        <Input label='Location' type='text' name='location' value={location} onChange={onChange} />
      </form>
    </div>
  )

  function onChange (e) {
    const payload = {}
    payload[e.target.name] = e.target.value
    dispatch({
      type: 'PROJECT_FORM_CHANGE',
      change: payload
    })
  }
})
