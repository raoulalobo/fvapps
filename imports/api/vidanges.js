import SimpleSchema from 'simpl-schema';
import { Meteor } from 'meteor/meteor';
import { Mongo } from 'meteor/mongo';

const insertion = new SimpleSchema({

    ordre: {
        type: String,
        label: 'O.R',
    },
    immatriculation: {
        type: String,
        label: 'immatriculation',
    },
    dateTime: {
        type: Date,
        label: 'Date de vidange',
    },
    type: {
        type: String,
        label: 'Type de vidange',
    },
    nbrVoyageSimple: {
        type: SimpleSchema.Integer,
        label: 'Nbr voyages vidange simple',
    },
    kilometrage: {
        type: SimpleSchema.Integer,
        label: 'Kilometrage',
    },
    observations: {
        type: String,
        label: 'Observations'
    }
});

const modification = new SimpleSchema({
    id: {
        type: String,
        label: 'Identifiant',
    }
});

modification.extend(insertion);

export const Vidanges = new Mongo.Collection('vidanges');



if ( Meteor.isServer ) {

    Meteor.publish('vidangesParDate', function(dateStart, dateEnd ) {
        return Vidanges.find({ dateTime: { $gte: dateStart , $lte: dateEnd } });
    });

    Meteor.publish('vidanges', function() {
        return Vidanges.find({});
    });

    Meteor.methods({
        'vidanges.insert'(  ordre, immatriculation, dateTime , type , nbrVoyageSimple ,kilometrage , observations ){
            if ( !this.userId ) {
                throw new Meteor.Error('not-authorized');
            }

            try {
                insertion.validate({  ordre, immatriculation, dateTime , type  , nbrVoyageSimple ,kilometrage , observations });
            } catch (e) {
                throw new Meteor.Error(400, e.message);
            }

            return Vidanges.insert({

                ordre,
                immatriculation,
                dateTime : dateTime.getTime() ,
                type ,
                nbrVoyageSimple ,
                kilometrage ,
                observations,
                creeLe: this.userId,
                creePar : new Date().getTime(),
                visible: true,
            } , (err,id)=>{ if (!err)
            { console.log(`Vidange du bus ${immatriculation} faite le : ${dateTime}`)}

            });
        },
        'vidanges.modify'( id , ordre, immatriculation, dateTime , type , nbrVoyageSimple ,kilometrage , observations ) {
            if ( !this.userId ) {
                throw new Meteor.Error('not-authorized');
            }

            modification.validate({ id ,ordre , immatriculation, dateTime , type , nbrVoyageSimple ,kilometrage , observations });

            Vidanges.update({
                _id : id
            }, {
                $set: {
                    ordre,
                    immatriculation,
                    dateTime : dateTime.getTime() ,
                    type ,
                    nbrVoyageSimple ,
                    kilometrage ,
                    observations,
                    modifieLe : new Date().getTime(),
                    modifiePar : this.userId
                }
            },(err)=>{ if (!err) { console.log(`Vidange du bus ${immatriculation} a ete modifie`) } });
        },
        'vidanges.disable'( id ) {
            if ( !this.userId ) {
                throw new Meteor.Error('not-authorized');
            }


            Vidanges.update({
                _id : id
            }, {
                $set: {
                    modifieLe : new Date().getTime(),
                    modifiePar : this.userId,
                    visible: false,
                }
            },(err)=>{ if (!err) { console.log(`Vidange du bus ${immatriculation} a ete modifie`) } });
        },
        'vidanges.delete'(id) {
            if ( !this.userId ) {
                throw new Meteor.Error('not-authorized');
            }
            Vidanges.remove(id);
        }
    })

}
