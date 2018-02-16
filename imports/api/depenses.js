import SimpleSchema from 'simpl-schema';
import { Meteor } from 'meteor/meteor';
import { Mongo } from 'meteor/mongo';

export const Depenses = new Mongo.Collection('depenses');

if ( Meteor.isServer ) {
    Meteor.publish('depenses', function(dateStart, dateEnd ) {
        return Depenses.find({ dateTime: { $gte: dateStart , $lte: dateEnd }, visible:true });
    });

    Meteor.methods({
        'depenses.insert'(dateTime , genre , code, desi , pu , qtte , notes , visible = true){
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
                    },
                    visible: {
                        type: Boolean,
                        label: 'Visible',
                    }
                }).validate({dateTime , genre , code, desi , pu , qtte , notes, visible });
            } catch (e) {
                throw new Meteor.Error(400, e.message);
            }

            return Depenses.insert({
                dateTime : dateTime.getTime(),
                genre ,
                code ,
                desi ,
                pu ,
                qtte ,
                notes ,
                visible,
                userId: this.userId,
                insertedAt : new Date().getTime(),
            } , (err)=>{ if (!err)  { console.log(`Depense -> Genre: ${genre} , Designation: ${desi}`)} });
        },
        'depenses.delete'(id) {
            Depenses.remove(id);
        },
        'depenses.modify'(_id, dateTime , genre , code, desi , pu , qtte , notes, visible = true ) {
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
                },
                visible: {
                    type: Boolean,
                    label: 'Visible',
                }
            }).validate({ _id , dateTime , genre , code, desi , pu , qtte , notes, visible });

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
                    visible,
                    updatedAt : new Date().getTime(),
                    updatedUserId : this.userId
                }
            },(err)=>{ if (!err) { console.log(`Depense -> Genre: ${genre} , Designation: ${desi}`) } });
        }
    })

}
