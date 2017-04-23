import React, { Component } from 'react';
import { connect } from 'react-redux';
import { Input } from '../common';

import User from '../models/User';

class Account extends Component {
  constructor(props) {
    super(props);
    User.getMe();
  }
  render () {
    return (
      <div>
        <AccountForm/>
      </div>
    );
  }
}


export default Account;


class AccountFormComponent extends Component {
  constructor(props) {
    super(props);
    this.onChange = this.onChange.bind(this);
    this.onSubmit = this.onSubmit.bind(this);
  }
  render() {
    const user =  {...this.props.me, ...this.props.accountForm};

    return (
      <form onSubmit={this.onSubmit}>
        {this.renderInputs(this.makeFieldInfos(user))}
        <button className="btn">Update</button>
      </form>
    )
  }
  onChange({ target }) {
    const { dispatch } = this.props;
    const change = {};
    change[target.name] = target.value;

    dispatch({
      type: 'ACCOUNT_FORM_CHANGE',
      change
    });
  }
  onSubmit(e) {
    e.preventDefault();
    User.updateMe(this.props.accountForm);
  }

  makeFieldInfos(user) {
    return Object.keys(user).map(key => {
      let value = user[key];
      return {
        key,
        value,
        name: key,
        label: this.mapNameToLabel(key),
        onChange: this.onChange
      };
    });
  }

  renderInputs(infos) {
    return infos.map(info => <Input key={info.name} {...info} />);
  }

  mapNameToLabel(name) {
    // Standard fields
    if (name === 'firstname') return 'First Name';
    if (name === 'lastname') return 'Last Name';
    if (name === 'phone') return 'Phone Number';
    if (name === 'phoneType') return 'Phone Type';
    if (name === 'role') return 'Role';

    // Photographer fields


    // Nonprofit Contact fields


    // default
    return name;
  }
}

function stateToProps ({ me, accountForm }) {
  return {me, accountForm};
}

const AccountForm = connect(stateToProps)(AccountFormComponent);