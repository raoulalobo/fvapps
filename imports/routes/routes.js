import React from 'react';
import { Meteor } from 'meteor/meteor';
import { Session } from 'meteor/session';
import { Router, Route, browserHistory } from 'react-router';

import Usrs from '../ui/Usrs';
import Resa from '../ui/Resa';
import Login from '../ui/Login';
import Colis from '../ui/Colis' ;
import NotFound from '../ui/NotFound';

export const onAuthChange = (isAuthenticated, currentPagePrivacy) => {
    const isUnauthenticatedPage = currentPagePrivacy === 'unauth';
    const isAuthenticatedPage = currentPagePrivacy === 'auth';

    if (isUnauthenticatedPage && isAuthenticated) {
        if ( Roles.userIsInRole(Meteor.userId(), 'admin') ) {
            browserHistory.replace('/users');
        } else {
            browserHistory.replace('/colis');
        }
    } else if (isAuthenticatedPage && !isAuthenticated) {
        browserHistory.replace('/');
    }
};
export const globalOnChange = (prevState, nextState) => {
    globalOnEnter(nextState);
};
export const globalOnEnter = (nextState) => {
    const lastRoute = nextState.routes[nextState.routes.length - 1];
    Session.set('currentPagePrivacy', lastRoute.privacy);
};


export const routes = (

  <Router history={browserHistory}>
    <Route onEnter={globalOnEnter} onChange={globalOnChange}>
      <Route path="/colis" component={Colis} privacy="auth" nomane="joedoe"/>
      <Route path="/users" component={Usrs} privacy="auth"/>
      <Route path="/resas" component={Resa} privacy="auth"/>
      <Route path="/" component={Login} privacy="unauth"/>
      <Route path="*" component={NotFound}/>
    </Route>
  </Router>
);
