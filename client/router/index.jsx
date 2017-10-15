import React, { Component } from 'react'
import { BrowserRouter as Router, Route, Switch } from 'react-router-dom'
import { Provider, connect } from 'react-redux'

import store from 'store'

import Project from 'models/project'
import User from 'models/user'
import 'images/favicon.png'

import Account from 'pages/account'
import Dashboard from 'pages/dashboard'
import Nonprofit from 'pages/nonprofit'
import Projects from 'pages/projects'
import ProjectEdit from 'pages/project/edit'
import ProjectNew from 'pages/project/new'
import ProjectView from 'pages/project'
import Search from 'pages/search'
import Storyteller from 'pages/storyteller'

import Header from 'components/Header'
import Footer from 'components/Footer'

class LoaderOrBody extends Component {
  constructor (props) {
    super(props)
    this.state = {loading: true}
    User.getMe()
  }
  componentWillReceiveProps ({ me }) {
    if (!this.state.loading) return
    if ('firstname' in me) {
      Project.get()
      this.setState({loading: false})
    }
  }
  render () {
    // const {me} = this.props
    return this.state.loading
    ? <div>Loading...</div>
    : (
      <div>
        <Header />
        <main className='main-container'>
          <Switch>
            {/* TODO Figure out how to properly authenticate routes */}
            <Route path='/account' component={Account} />
            <Route path='/nonprofit/:id' component={Nonprofit} />
            <Route path='/project/new' component={ProjectNew} />
            <Route path='/project/:id/edit' component={ProjectEdit} />
            <Route path='/project/:id' component={ProjectView} />
            <Route path='/projects' component={Projects} />
            <Route path='/search' component={Search} />
            <Route path='/storyteller/:userId' component={Storyteller} />
            <Route path='/' component={Dashboard} />
          </Switch>
        </main>
        <Footer />
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
