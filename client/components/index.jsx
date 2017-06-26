import React, { Component } from 'react'
import { BrowserRouter as Router, Route, Switch } from 'react-router-dom'
import { Provider, connect } from 'react-redux'
import store from '../store/index'
import { Project as ProjectModel, User } from '../models'

import {
  Account,
  Dashboard,
  NewProject,
  Nonprofit,
  Project,
  Search,
  Storyteller,
  ViewProject
} from './pages'
import Header from './header'
import Nav from './nav'

class LoaderOrBody extends Component {
  constructor (props) {
    super(props)
    this.state = {loading: true}
    User.getMe()
  }
  componentWillReceiveProps ({ me }) {
    if (!this.state.loading) return
    if ('firstname' in me) {
      ProjectModel.get()
      this.setState({loading: false})
    }
  }
  render () {
    // const {me} = this.props
    return this.state.loading
    ? <div>Loading...</div>
    : (
      <div>
        <Header key='header' />
        <div className='container-fluid'>
          <div key='main' className='row'>
            <Route path='/' component={Nav} />
            <div className='col-sm-12 col-md-9'>
              <Switch>
                {/* TODO Figure out how to properly authenticate routes */}
                <Route path='/account' component={Account} />
                <Route path='/nonprofit/:id' component={Nonprofit} />
                <Route path='/project/new' component={NewProject} />
                <Route path='/project/:id' component={ViewProject} />
                <Route path='/project' component={Project} />
                <Route path='/search' component={Search} />
                <Route path='/storyteller/:userId' component={Storyteller} />
                <Route path='/' component={Dashboard} />
              </Switch>
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
