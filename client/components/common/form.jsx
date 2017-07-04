import React from 'react'
import PT from 'prop-types'
import { fields } from 'client-config'
import { Input } from '../common'

export default function Form ({ base, changes, changeAction, onSubmit }, { store }) {
  const obj = {...base, ...changes}
  const { dispatch } = store
  return (
    <form onSubmit={onSubmit}>
      {renderInputs(makeFieldInfos(obj, onChange.bind(null, dispatch, changeAction)))}
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

function makeFieldInfos (inputs, onChange) {
  return Object.keys(inputs).map(key => {
    if (key === 'nonprofit') return null
    const info = {
      key,
      ...fields.all[key],
      onChange,
      value: inputs[key]
    }

    return info
  })
}

function renderInputs (infos) {
  return infos.map(info => {
    if (info === null) return info
    return <Input key={info.name} {...info} />
  })
}

function onChange (dispatch, type, { target }) {
  const change = {}
  change[target.name] = target.value

  dispatch({type, change})
}
