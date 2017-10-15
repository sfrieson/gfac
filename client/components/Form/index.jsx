import React, { Component } from 'react'
import PT from 'prop-types'
import { fields } from 'client-config'
import Input from 'components/Input'
import { Button, Form as AntForm } from 'antd'

class Form extends Component {
  render () {
    const { fields, base, changes, changeAction, onSubmit } = this.props
    const { store } = this.context

    const values = {...base, ...changes}
    const { dispatch } = store
    return (
      <AntForm onSubmit={onSubmit}>
        {renderInputs(makeFieldProps(fields, values, onChange.bind(null, dispatch, changeAction)))}
        <Button type='primary'>Update</Button>
      </AntForm>
    )
  }
}

Form.propTypes = {
  changeAction: PT.string.isRequired,
  onSubmit: PT.func.isRequired,
  base: PT.object.isRequired,
  changes: PT.object.isRequired
}

Form.contextTypes = {
  store: PT.object.isRequired
}

function makeFieldProps (formFields, values, onChange) {
  return formFields.map(fieldName => {
    const props = {
      key: fieldName,
      ...fields[fieldName],
      onChange,
      value: values[fieldName] || ''
    }

    return props
  })
}

function renderInputs (infos) {
  return infos.map(info => (
    <AntForm.Item key={info.label} label={info.label}>
      <Input {...info} />
    </AntForm.Item>
  ))
}

function onChange (dispatch, type, { target }) {
  const change = {}
  change[target.name] = target.value

  dispatch({type, change})
}

export default AntForm.create()(Form)
