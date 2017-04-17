import React from 'react';
import { Router, Route } from 'react-router';
import createBrowserHistory from 'history/createBrowserHistory';
import Home from './home';

const history = createBrowserHistory();

export default (
  <Router history={history}>
    <Route path="/" component={Home} />
  </Router>
);