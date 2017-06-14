import { Meteor } from 'meteor/meteor';
import SimpleSchema from 'simpl-schema';
import { Accounts } from 'meteor/accounts-base';

if (Meteor.isServer) {
    Meteor.publish('allUsers', function () {
        return Meteor.users.find();
    });
}


Meteor.methods({
    'add.role'(usrId) {
        if (!this.userId) {
            throw new Meteor.Error('not-authorized');
        }

        Roles.addUsersToRoles(usrId,'admin');
    },
    'create.user' (email, password) {

        new SimpleSchema({
            email: {
                type: String,
                regEx: SimpleSchema.RegEx.Email
            }
        }).validate({ email });

        if (Meteor.isServer) {
            Accounts.createUser({email, password});
        }

    }

});