import React, { Component } from 'react';
import User from '../models/User';

class Home extends Component {
  componentWillMount() { User.getMe(); }
  render() {
    return (
      <div>
        <h1>Gramforacause!</h1>
      </div>
    );
  }
}

export default Home;