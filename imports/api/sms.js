import { Meteor } from 'meteor/meteor';

if ( Meteor.isServer ){

    Meteor.methods({
        nkSMS: function ( message) {

            var request = require('request');
            //
            request(`http://api.vassarl.com:9501/api?action=sendmessage&username=FINEXS&password=Finexs12345&recipient=237697509899,237696669942&messagetype=SMS:TEXT&messagedata=${message}`, { json: true }, (err, res, body) => {
                if (err) { return console.log(err); }
                //console.log(res.body);
            });
            // http://api.vassarl.com:9501/api?action=sendmessage&username=FINEXS&password=Finexs12345&recipient=237696849789,237697509899&messagetype=SMS:TEXT&messagedata=raddVIP
        }
    });
}

