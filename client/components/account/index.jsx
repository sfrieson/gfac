import React, { Component } from 'react';
import { connect } from 'react-redux';

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
      </div>
    );
  }
}
function stateToProps ({ me }) {
  return {me};
}


export default connect(stateToProps)(Account);