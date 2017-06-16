import 'moment/locale/fr';
import moment from 'moment';
import request from 'request';
import { Mongo } from 'meteor/mongo';
import { Meteor } from 'meteor/meteor';
import SimpleSchema from 'simpl-schema';

export const Resas = new Mongo.Collection('resas');

if ( Meteor.isServer ) {
    Meteor.publish('resas', function() {
        return Resas.find({});
    });

    Meteor.methods({
        'resas.insert'(resa , cni , phone , name , desc){
            if (!this.userId) {
                throw new Meteor.Error('not-authorized');
            }

            try {
                new SimpleSchema({
                    resa: {
                        type: Date,
                        label: 'Date',
                    },
                    cni: {
                        type: String,
                        label: 'CNI',
                    },
                    phone: {
                        type: String,
                        label: 'Tel dest.',
                        regEx: SimpleSchema.RegEx.Phone,
                        min : 12,
                        max : 12
                    },
                    name: {
                        type: String,
                        label: 'Nom',
                    },
                    desc: {
                        type: String,
                        label: 'Desc. pack.',
                        min : 3,
                        max : 70,
                    }
                }).validate({resa , cni , phone , name , desc});
            } catch (e) {
                throw new Meteor.Error(400, e.message);
            }

            Resas.insert({
                resa : resa,
                cni,
                phone,
                name,
                desc,
                userId: this.userId,
                visible: true,
                paid : false,
            } , (err)=>{ if (!err)  {
                const sender = 'FINEXS VOYAGES' ;
                const sms = `Hi ${name}, Resa pour ${ moment(resa).locale("fr").format("dddd, lll")} ; Expire 30min avant l'heure de la resa. Tels : 699998636/696943131/691819290/691817924`;
                //const message = nameDest+', votre colis ('+code+') est en route ,bus '+bus+'. Si apres 05 ou 06h de temps vous avez pas recu de retour appelez le 697509899';
                request('http://api.vassarl.com:9501/api?action=sendmessage&username=FINEXS&password=Finexs12345&originator='+sender+'&recipient='+phone+'&messagetype=SMS:TEXT&messagedata='+sms, function (error, response, body) {
                    if (!error && response.statusCode == 200) { }
                })

            }

            });
        },
        'resas.confirmation' (_id, visible) {
            if (!this.userId) {
                throw new Meteor.Error('not-authorized');
            }
            Resas.update( _id, { $set: { paid : visible } } );
        },
        'resa.deleted'(_id ) {
            if (!this.userId) {
                throw new Meteor.Error('not-authorized');
            }

            new SimpleSchema({
                _id: {
                    type: String,
                    min: 1
                }
            }).validate({ _id });

            Resas.update({
                _id
            }, {
                $set: {
                    deletedAt : new Date().getTime(),
                    visible: false,
                    userIdDeleted : this.userId
                }
            });
        }


    });
}

