import React, { Component } from 'react';
import { connect } from 'react-redux';
import User from '../models/User';

class Home extends Component {
  constructor (props) {
    super(props);
    User.getMe();
  }
  render() {
    const { me } = this.props;

    return (
      <div>
        <h1>Rendering React just for you, {me.firstname ? me.firstname : 'my dear'}!</h1>
      </div>
    );
  }
}
function stateToProps ({ me }) {
  return {me};
}


export default connect(stateToProps)(Home);