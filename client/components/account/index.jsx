import React, { Component } from 'react'
import { connect } from 'react-redux'
import { Input } from '../common'

import User from '../models/User'
import fields from '../../../fields.json'

class AccountFormComponent extends Component {
  constructor (props) {
    super(props)
    this.onChange = this.onChange.bind(this)
    this.onSubmit = this.onSubmit.bind(this)
  }
  render () {
    const user = {...this.props.me, ...this.props.accountForm}

    return (
      <form onSubmit={this.onSubmit}>
        {this.renderInputs(this.makeFieldInfos(user))}
        <button className='btn'>Update</button>
      </form>
    )
  }
  onChange ({ target }) {
    const { dispatch } = this.props
    const change = {}
    change[target.name] = target.value

    dispatch({
      type: 'ACCOUNT_FORM_CHANGE',
      change
    })
  }
  onSubmit (e) {
    e.preventDefault()
    User.updateMe(this.props.accountForm)
  }

  makeFieldInfos (user) {
    return Object.keys(user).map(key => {
      if (key === 'nonprofit') return null
      const info = {
        key,
        ...fields.all[key],
        onChange: this.onChange,
        value: user[key]
      }

      return info
    })
  }

  renderInputs (infos) {
    return infos.map(info => {
      if (info === null) return info
      return <Input key={info.name} {...info} />
    })
  }
}

function stateToProps ({ me, accountForm }) {
  return {me, accountForm}
}

const AccountForm = connect(stateToProps)(AccountFormComponent)

class Account extends Component {
  constructor (props) {
    super(props)
    User.getMe()
  }
  render () {
    return (
      <div>
        <AccountForm />
      </div>
    )
  }
}

export default Account
