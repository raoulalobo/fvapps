import SimpleSchema from 'simpl-schema';
import { Meteor } from 'meteor/meteor';
import { Mongo } from 'meteor/mongo';

export const Depenses = new Mongo.Collection('depenses');

if ( Meteor.isServer ) {
    Meteor.publish('depenses', function(dateStart, dateEnd ) {
        return Depenses.find({ dateTime: { $gte: dateStart , $lte: dateEnd } });
    });

    Meteor.methods({
        'depenses.insert'(dateTime , genre , code, desi , pu , qtte , notes ){
            if (!this.userId) {
                throw new Meteor.Error('not-authorized');
            }

            try {
                new SimpleSchema({
                    dateTime: {
                        type: Date,
                        label: 'Date',
                    },
                    genre: {
                        type: String,
                        label: 'genre',
                        allowedValues: ['DCB','DCN','DCG','DAY','DAD'],
                        // DC-> Depenses Carburant - Bus, Navettes, Groupe
                        // DA-> Depenses Agences - yde, Dla
                    },
                    code: {
                        type: String,
                        label: 'code'
                    },
                    desi: {
                        type: String,
                        label: 'Designation',
                        min : 2,
                        max : 70,
                    },
                    pu: {
                        type: SimpleSchema.Integer,
                        label: 'Prix unit.',
                    },
                    qtte: {
                        type: SimpleSchema.Integer,
                        label: 'Quantite',
                    },
                    notes: {
                        type: String,
                        label: 'Notes',
                        min : 0,
                        max : 70,
                    }
                }).validate({dateTime , genre , code, desi , pu , qtte , notes});
            } catch (e) {
                throw new Meteor.Error(400, e.message);
            }

            Depenses.insert({
                dateTime : dateTime.getTime(),
                genre ,
                code ,
                desi ,
                pu ,
                qtte ,
                notes ,
                userId: this.userId,
                insertedAt : new Date().getTime(),
                visible: true,
            } , (err)=>{ if (!err)  { console.log(`Depense -> Genre: ${genre} , Designation: ${desi}`)} });
        },
        'depenses.modify'(_id, dateTime , genre , code, desi , pu , qtte , notes ) {
            if (!this.userId) {
                throw new Meteor.Error('not-authorized');
            }

            new SimpleSchema({
                _id: {
                    type: String,
                    label: '_id',
                },
                dateTime: {
                    type: Date,
                    label: 'Date',
                },
                genre: {
                    type: String,
                    label: 'genre',
                    allowedValues: ['DCB','DCN','DCG','DAY','DAD'],
                },
                code: {
                    type: String,
                    label: 'code'
                },
                desi: {
                    type: String,
                    label: 'Designation',
                    min : 2,
                    max : 70,
                },
                pu: {
                    type: SimpleSchema.Integer,
                    label: 'Prix unit.',
                },
                qtte: {
                    type: SimpleSchema.Integer,
                    label: 'Quantite',
                },
                notes: {
                    type: String,
                    label: 'Notes',
                    min : 0,
                    max : 70,
                }
            }).validate({ _id , dateTime , genre , code, desi , pu , qtte , notes});

            Depenses.update({
                _id
            }, {
                $set: {
                    dateTime : dateTime.getTime(),
                    genre ,
                    code ,
                    desi ,
                    pu ,
                    qtte ,
                    notes ,
                    updatedAt : new Date().getTime(),
                    updatedUserId : this.userId
                }
            },(err)=>{ if (!err) { console.log(`Depense -> Genre: ${genre} , Designation: ${desi}`) } });
        }
    })

}
