import React, { Component } from 'react';
import { connect } from 'react-redux';

class Home extends Component {
  constructor (props) {
    super(props);
  }
  render() {
    return <h1 onClick={this.props.onClick}>Rendering React just for you, my dear!</h1>;
  }
}

function mapStateToProps ({ clickCount }) {
  return {clickCount};
}

function mapDispatchToProps (dispatch) {
  return {
    onClick: () => {
      dispatch({
        type: 'CLICK'
      })
    }
  };
}

export default connect(mapStateToProps, mapDispatchToProps)(Home);