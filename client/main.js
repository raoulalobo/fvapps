import ReactDOM from 'react-dom';
import { Meteor } from 'meteor/meteor';
import { Tracker } from 'meteor/tracker';
import { Session } from 'meteor/session';
import { Accounts } from 'meteor/accounts-base';

import '../imports/startup/simple-schema-configuration.js';
import { routes, onAuthChange } from '../imports/routes/routes';

Tracker.autorun(() => {
    const isAuthenticated = !!Meteor.userId();
    const currentPagePrivacy = Session.get('currentPagePrivacy');
    //console.log(isAuthenticated,currentPagePrivacy);
    onAuthChange(isAuthenticated, currentPagePrivacy);
});




Meteor.startup(() => {
    ReactDOM.render(routes, document.getElementById('app'));
});
