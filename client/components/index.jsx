import React from 'react'
import { BrowserRouter as Router, Route } from 'react-router-dom'
import { Provider } from 'react-redux'

import store from './store/index'
import Home from './home'
import Account from './account'
import Project from './project'
import Header from './header'

export default (
  <Provider store={store}>
    <Router>
      <div className='container-fluid'>
        <div className='row'>
          <Route path='/' component={Header} />
          <div className='col-sm-12 col-md-9'>
            <Route path='/' component={Home} />
            <Route path='/account' component={Account} />
            <Route path='/project' component={Project} />
          </div>
        </div>
      </div>
    </Router>
  </Provider>
)
