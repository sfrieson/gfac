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
    var { me } = this.props;
    return (
      <div>
        This is what your account looks like.
        <pre>
          {JSON.stringify(me, null, 2)}
        </pre>
        <AccountForm user={me} />
      </div>
    );
  }



}
function stateToProps ({ me }) {
  return {me};
}


export default connect(stateToProps)(Account);


class AccountForm extends Component {
  render() {
    const { user } = this.props;

    return (
      <form>
        {this.renderInputs(this.makeFieldInfos(user))}
      </form>
    )
  }
  makeFieldInfos(user) {
    return Object.keys(user).map(key => {
      let value = user[key];
      return {
        key,
        value,
        name: key,
        label: this.mapNameToLabel(key)
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