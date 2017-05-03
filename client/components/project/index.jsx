import React from 'react'
import { connect } from 'react-redux'
import { Input } from '../common'

const stateToProps = ({ projectForm }) => ({projectForm})

export default connect(stateToProps)(function ({ projectForm, dispatch }) {
  return (
    <div>
      New Project Form
      <form>
        <Input label='Name' type='text' name='name' value={projectForm.name} onChange={onChange} />
        <Input label='Description' type='textarea' name='description' value={projectForm.description} onChange={onChange} />
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
