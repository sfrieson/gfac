import React from 'react';
import { BrowserRouter as Router, Route } from 'react-router-dom';
import createBrowserHistory from 'history/createBrowserHistory';
import Home from './home';
import Account from './account';

const history = createBrowserHistory();

export default (
  <Router history={history}>
    <div>
      <Route path="/" component={Home} />
      <Route path="/account" component={Account} />
    </div>
  </Router>
);