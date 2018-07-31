import React from 'react';
import { Meteor } from 'meteor/meteor';
import { Session } from 'meteor/session';
import { Router, Route, browserHistory } from 'react-router';

import Usrs from '../ui/Usrs';
import Resa from '../ui/Resa';
import Vidanges from '../ui/Vidanges';
import Login from '../ui/Login';
import Colis from '../ui/Colis' ;
import Mmoneys from '../ui/Mmoneys' ;
import Departs from '../ui/Departs' ;
import Sorties from '../ui/Sorties' ;
import SortiesAjout from '../ui/SortiesAjout' ;
import Employes from '../ui/Employes' ;
import Alertes from '../ui/Alertes' ;
import Depenses from '../ui/Depenses' ;
import NotFound from '../ui/NotFound';
import Parametres from '../ui/Parametres';

export const onAuthChange = (isAuthenticated, currentPagePrivacy) => {
    const isUnauthenticatedPage = currentPagePrivacy === 'unauth';
    const isAuthenticatedPage = currentPagePrivacy === 'auth';

    if (isUnauthenticatedPage && isAuthenticated) {
        if ( Roles.userIsInRole(Meteor.userId(), 'admin' ) ) {
            browserHistory.replace('/users');
        } else {
            if ( Roles.userIsInRole(Meteor.userId(), 'colis' ) ) { browserHistory.replace('/mobilemoney');}
            if ( Roles.userIsInRole(Meteor.userId(), 'caisse' ) ) { browserHistory.replace('/departs');}
        }
    } else if (isAuthenticatedPage && !isAuthenticated) {
        browserHistory.replace('/');
    }
};
export const globalOnChange = (prevState, nextState) => {
    globalOnEnter(nextState);
    console.log(prevState,nextState);
};
export const globalOnEnter = (nextState) => {
    const lastRoute = nextState.routes[nextState.routes.length - 1];
    console.log(nextState);
    Session.set('currentPagePrivacy', lastRoute.privacy);
    //Session.set('permissionRole', lastRoute.nomane);
};

const rls_0 = ['admin'];
const rls_1 = ['admin','caisse','colis'];
const rls_11 = ['colis','caisse'];
const rls_2 = ['admin','caisse','colis'];

const onEnterRolePage = (nextState) => {
    console.log(nextState);
    const lastRoute = nextState.routes[nextState.routes.length - 1];
    Session.set('permissionRole', lastRoute.nomane);
    const permissionRole = Session.get('permissionRole');
    if ( !Roles.userIsInRole(Meteor.userId(), permissionRole ) ) {
        browserHistory.replace('/NotFound');
    }
};

export const routes = (

    <Router history={browserHistory}>
        <Route onEnter={globalOnEnter} onChange={globalOnChange}>

            <Route path="/users" component={Usrs} privacy="auth" nomane={rls_0} onEnter={onEnterRolePage}/>
            <Route path="/mobilemoney" component={Mmoneys} privacy="auth" nomane={rls_2} onEnter={onEnterRolePage}/>
            <Route path="/parametres" component={Parametres} privacy="auth" nomane={rls_11} onEnter={onEnterRolePage}/>
            <Route path="/departs" component={Departs} privacy="auth" nomane={rls_1} onEnter={onEnterRolePage}/>
            <Route path="/employes" component={Employes} privacy="auth" nomane={rls_1} onEnter={onEnterRolePage}/>
            <Route path="/alertes" component={Alertes} privacy="auth" nomane={rls_1} onEnter={onEnterRolePage}/>
            <Route path="/vidanges" component={Vidanges} privacy="auth" nomane={rls_1} onEnter={onEnterRolePage}/>
            <Route path="/depenses" component={Depenses} privacy="auth" nomane={rls_1} onEnter={onEnterRolePage}/>
            <Route path="/colis" component={Colis} privacy="auth" nomane={rls_2} onEnter={onEnterRolePage}/>
            <Route path="/sorties" component={Sorties} privacy="auth" nomane={rls_2} onEnter={onEnterRolePage}/>
            <Route path="/sortiesajout" component={SortiesAjout} privacy="auth" nomane={rls_2} onEnter={onEnterRolePage}/>
            <Route path="/resas" component={Resa} privacy="auth" nomane={rls_2} onEnter={onEnterRolePage}/>
            <Route path="/" component={Login} privacy="unauth" nomane="joedoe5"/>
            <Route path="*" component={NotFound}/>
        </Route>
    </Router>
);
