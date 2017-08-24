import { Meteor } from 'meteor/meteor';
import SimpleSchema from 'simpl-schema';
import { Accounts } from 'meteor/accounts-base';

if (Meteor.isServer) {
    Meteor.publish('allUsers', function () {
        return Meteor.users.find();
    });
}


Meteor.methods({
    'add.role'(usrId,rls) {
        if (!this.userId) {
            throw new Meteor.Error('not-authorized');
        }

        Roles.addUsersToRoles(usrId,rls);
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

    },
    'delete.user'(_id ) {
        if (!this.userId) {
            throw new Meteor.Error('not-authorized');
        }

        new SimpleSchema({
            _id: {
                type: String,
                min: 1
            }
        }).validate({ _id });

        Meteor.users.remove({ _id });
    }

});