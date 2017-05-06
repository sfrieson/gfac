import React from 'react'
import { connect } from 'react-redux'
import { Input } from '../common'

import { Nonprofit, User } from '../models'
import fields from '../../../fields.json'

export default connect(({ me, accountForm, nonprofitForm }) => ({me, accountForm, nonprofitForm}))(
  function Account ({ dispatch, me, accountForm, nonprofitForm }) {
    const accountChange = onChange.bind(null, dispatch, 'ACCOUNT_FORM_CHANGE')
    const nonprofitChange = onChange.bind(null, dispatch, 'NONPROFIT_FORM_CHANGE')
    const { nonprofit } = me
    const accountSubmit = function (e) {
      e.preventDefault()
      User.updateMe(accountForm)
    }
    const nonprofitSubmit = function (e) {
      e.preventDefault()
      Nonprofit.update(nonprofitForm)
    }

    return (
      <div>
        <h2>Account Information</h2>
        {renderUserForm(me, accountForm, accountChange, accountSubmit)}
        {nonprofit && <h3>Nonprofit Information</h3>}
        {nonprofit && renderUserForm(nonprofit, nonprofitForm, nonprofitChange, nonprofitSubmit)}
      </div>
    )
  }
)

// -------
// Generic
// -------

function renderUserForm (base, changes, onChange, onSubmit) {
  const obj = {...base, ...changes}
  return (
    <form onSubmit={onSubmit}>
      {renderInputs(makeFieldInfos(obj, onChange))}
      <button className='btn'>Update</button>
    </form>
  )
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
