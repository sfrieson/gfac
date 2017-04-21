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
        <form>
          {this.renderInputs(me)}
        </form>
      </div>
    );
  }

  renderInputs(me) {
    console.log('in the input renderer', Object.keys(me))
    return Object.keys(me).map(key => {
      let value = me[key];

      return <Input key={key} value={value} name={key} label={key} />
    });
  }

}
function stateToProps ({ me }) {
  return {me};
}


export default connect(stateToProps)(Account);