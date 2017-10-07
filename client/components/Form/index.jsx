import React from 'react'
import PT from 'prop-types'
import { fields } from 'client-config'
import Input from 'components/Input'

export default function Form ({ fields, base, changes, changeAction, onSubmit }, { store }) {
  const values = {...base, ...changes}
  const { dispatch } = store
  return (
    <form onSubmit={onSubmit}>
      {renderInputs(makeFieldProps(fields, values, onChange.bind(null, dispatch, changeAction)))}
      <button className='btn'>Update</button>
    </form>
  )
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
  return infos.map(info => <Input {...info} />)
}

function onChange (dispatch, type, { target }) {
  const change = {}
  change[target.name] = target.value

  dispatch({type, change})
}
