import React from 'react'
import { connect } from 'react-redux'
import Form from 'components/Form'

import Nonprofit from 'models/nonprofit'
import User from 'models/user'
import config from 'client-config'
const {
  fieldsets: {
    editContact,
    editNonprofit,
    editStoryteller,
    editUser
  }
} = config

export default connect(({ me, accountForm, nonprofitForm }) => ({me, accountForm, nonprofitForm}))(
  function Account ({ dispatch, me, accountForm, nonprofitForm }) {
    const { nonprofit, role } = me
    let userFields = [...editUser]
    if (role === 'storyteller') userFields = userFields.concat(editStoryteller)
    if (role === 'contact') userFields = userFields.concat(editContact)
    const accountSubmit = function (e) {
      e.preventDefault()
      User.updateMe(accountForm)
    }
    const nonprofitSubmit = function (e) {
      e.preventDefault()
      Nonprofit.update(nonprofit.id, nonprofitForm)
    }

    return (
      <div>
        <h2>Account Information</h2>
        <Form fields={userFields} base={me} changes={accountForm} changeAction='ACCOUNT_FORM_CHANGE' onSubmit={accountSubmit} />
        {nonprofit && <h3>Nonprofit Information</h3>}
        {nonprofit && <Form fields={editNonprofit} base={nonprofit} changes={nonprofitForm} changeAction='NONPROFIT_FORM_CHANGE' onSubmit={nonprofitSubmit} />}
      </div>
    )
  }
)
