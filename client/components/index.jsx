import React, { Component } from 'react'
import { BrowserRouter as Router, Route } from 'react-router-dom'
import { Provider, connect } from 'react-redux'

import store from './store/index'
import Dashboard from './dashboard'
import Account from './account'
import Project, { NewProject, ViewProject } from './project'
import Header from './header'
import Nav from './nav'
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
      <div>
        <Header key='header' />
        <div className='container-fluid'>
          <div key='main' className='row'>
            <Route path='/' component={Nav} />
            <div className='col-sm-12 col-md-9'>
              <Route exact path='/' component={Dashboard} />
              <Route path='/account' component={Account} />
              <Route exact path='/project' component={Project} />
              <Route exact path='/project/new' component={NewProject} />
              <Route exact path='/project/:id' component={ViewProject} />
            </div>
          </div>
        </div>
      </div>
    )
  }
}

const Loader = connect(({ me }) => ({me}))(LoaderOrBody)
export default (
  <Provider store={store}>
    <Router>
      <Route path='*' component={Loader} />
    </Router>
  </Provider>
)
