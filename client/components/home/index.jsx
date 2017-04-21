import React, { Component } from 'react';
import { connect } from 'react-redux';
import User from '../models/User';

class Home extends Component {
  constructor (props) {
    super(props);
    User.getMe();
  }
  render() {
    const { clickCount, me } = this.props;

    return (
      <div>
        <h1 onClick={this.props.onClick}>Rendering React just for you, {me.firstname ? me.firstname : 'my dear'}!</h1>
        <p>{clickCount} click{clickCount === 1 ? '' : 's'}.</p>
      </div>
    );
  }
}
function stateToProps ({ clickCount, me }) {
  return {clickCount, me};
}
function dispatchToProps (dispatch) {
  return {
    onClick: () => {
      dispatch({
        type: 'CLICK'
      })
    }
  };
}

export default connect(stateToProps, dispatchToProps)(Home);