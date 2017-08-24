import { Meteor } from 'meteor/meteor';

import '../imports/api/users';
import '../imports/api/sms';
import '../imports/api/resas';
import '../imports/api/departs';
import '../imports/api/depenses';
import '../imports/api/colis';
import '../imports/startup/simple-schema-configuration.js';

Meteor.startup(() => {
    // code to run on server at startup
});