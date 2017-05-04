import React from 'react';
import { Route } from 'react-router';

/* containers */
import App from '../containers/App';
import Home from '../components/Home';
import Admin from '../components/Admin';
import Student from '../components/Student';

export default (
  <Route path="/" component={App}>
    <Route path="home" component={Home} />
    <Route path="admin" component={Admin} />
    <Route path="student" component={Student} />
    <Route path="*" component={Home} />
  </Route>
);
