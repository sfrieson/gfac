import React, { Component } from 'react'
import { BrowserRouter as Router, Route } from 'react-router-dom'
import { Provider, connect } from 'react-redux'

import store from './store/index'
import Home from './home'
import Account from './account'
import Project, { NewProject } from './project'
import Header from './header'
import User from './models/User'

class LoaderOrBody extends Component {
  constructor (props) {
    super(props)
    this.state = {loading: true}
    User.getMe()
  }
  componentWillReceiveProps ({ me }) {
    if (!('firstname' in this.props.me) && ('firstname' in me)) this.setState({loading: false})
  }
  render () {
    return this.state.loading ? <div>Loading...</div>
    : (
      <div className='row'>
        <Route path='/' component={Header} />
        <div className='col-sm-12 col-md-9'>
          <Route path='/' component={Home} />
          <Route path='/account' component={Account} />
          <Route exact path='/project' component={Project} />
          <Route exact path='/project/new' component={NewProject} />
        </div>
      </div>
    )
  }
}

const Loader = connect(({ me }) => ({me}))(LoaderOrBody)
export default (
  <Provider store={store}>
    <Router>
      <div className='container-fluid'>
        <Route path='*' component={Loader} />
      </div>
    </Router>
  </Provider>
)
