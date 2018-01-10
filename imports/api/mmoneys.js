import SimpleSchema from 'simpl-schema';
import { Meteor } from 'meteor/meteor';
import { Mongo } from 'meteor/mongo';

const insertion = new SimpleSchema({

    ticket: {
        type: String,
        label: 'Numero ticket',
    },
    dateTime: {
        type: Date,
        label: 'Date du paiement',
    },
    dateTimeV: {
        type: Date,
        label: 'Date du voyage',
    },
    nom: {
        type: String,
        label: 'Noms et Prenoms',
    },
    cni: {
        type: String,
        label: 'Destination',
    },
    phone: {
        type: String,
        label: 'Telephone',
    },
    observations: {
        type: String,
        label: 'Observations'
    }
});

const modification = new SimpleSchema({
    ticket: {
        type: String,
        label: 'Numero ticket',
    }
});

modification.extend(insertion);

export const Mmoneys = new Mongo.Collection('mmoneys');



if ( Meteor.isServer ) {

    Meteor.publish('mmoneys', function(dateStart, dateEnd ) {
        //return Mmoneys.find({ dateTimeV: { $gte: dateStart , $lte: dateEnd } });
        return Mmoneys.find({ $or: [ { dateTime: { $gte: dateStart , $lte: dateEnd } } , { dateTimeV: { $gte: dateStart , $lte: dateEnd } }] });
    });

    Meteor.publish('cashMmoneys', function() {
        return Mmoneys.find({});
    });

    Meteor.methods({
        'mmoneys.insert'(  ticket, dateTime , dateTimeV , nom , cni ,phone , observations ){

            if ( !this.userId ) {
                throw new Meteor.Error('not-authorized');
            }

            try {
                insertion.validate({  ticket, dateTime , dateTimeV , nom , cni , phone , observations });
            } catch (e) {
                throw new Meteor.Error(400, e.message);
            }

            if ( Mmoneys.find({ticket}).fetch().length > 0 ) {
                throw new Meteor.Error('bad',`Le ${ticket} existe deja`);
            }

            return Mmoneys.insert({

                _id : ticket,
                ticket,
                dateTime : dateTime.getTime(),
                dateTimeV : dateTimeV.getTime(),
                nom,
                cni,
                phone,
                observations,
                creeLe: this.userId,
                creePar : new Date().getTime(),
                visible: true,
            } , (err,id)=>{ if (!err)
            { console.log(`Le ticket : # ${ticket} passager : ${nom}`)}

            });
        },
        'mmoneys.modify'( ticket, dateTime , nom , cni , phone , observations ) {
            if ( !this.userId ) {
                throw new Meteor.Error('not-authorized');
            }

            modification.validate({ ticket , dateTime , nom , cni , phone , observations });

            Mmoneys.update({
                _id : ticket
            }, {
                $set: {
                    dateTime : dateTime.getTime(),
                    nom,
                    cni,
                    phone ,
                    observations,
                    modifieLe : new Date().getTime(),
                    modifiePar : this.userId
                }
            },(err)=>{ if (!err) { console.log(`Le ticket : # ${ticket} passager : ${nom}`) } });
        },
        'mmoneys.delete'(id) {
            if ( !this.userId ) {
                throw new Meteor.Error('not-authorized');
            }
            Mmoneys.remove(id);
        }
    })

}
