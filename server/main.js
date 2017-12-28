import { Meteor } from 'meteor/meteor';

import '../imports/api/users';
import '../imports/api/sms';
import '../imports/api/resas';
import '../imports/api/mmoneys';
import '../imports/api/departs';
import '../imports/api/depenses';
import '../imports/api/hotesses';
import '../imports/api/colis';
import '../imports/startup/simple-schema-configuration.js';

Meteor.startup(() => {
    // code to run on server at startup
    if ( Meteor.users.find().count() === 0 ) {

        console.log(`Creation d'un user`);

        const identifiant = Accounts.createUser({
            email: "nathanaelalobo@gmail.com",
            password: "admin",
            profile: {username: 'radd'},
            profile: {name: 'raoulalobo'},
            roles: ['admin']
        });

        Roles.setUserRoles(identifiant,'admin');
    }
});