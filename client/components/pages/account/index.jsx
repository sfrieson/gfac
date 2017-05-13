import React from 'react'
import { connect } from 'react-redux'
import { Form } from '../../common'

import { Nonprofit, User } from '../../models'

export default connect(({ me, accountForm, nonprofitForm }) => ({me, accountForm, nonprofitForm}))(
  function Account ({ dispatch, me, accountForm, nonprofitForm }) {
    const { nonprofit } = me
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
        <Form base={me} changes={accountForm} changeAction='ACCOUNT_FORM_CHANGE' onSubmit={accountSubmit} />
        {nonprofit && <h3>Nonprofit Information</h3>}
        {nonprofit && <Form base={nonprofit} changes={nonprofitForm} changeAction='NONPROFIT_FORM_CHANGE' onSubmit={nonprofitSubmit} />}
      </div>
    )
  }
)
