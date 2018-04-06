import SimpleSchema from 'simpl-schema';
import { Meteor } from 'meteor/meteor';
import { Mongo } from 'meteor/mongo';


export const Departs = new Mongo.Collection('departs');

if ( Meteor.isServer ) {

    Meteor.publish('departs', function(dateStart, dateEnd ) {
        return Departs.find({ dateTime: { $gte: dateStart , $lte: dateEnd } });
    });

    Meteor.publish('departsVidanges', function( ) {
        return Departs.find({});
    });

    Meteor.methods({
        'departs.insert'(depenseId, dateTime , imm , dest , driver , fuel, fdr , amount , seats , leasing ,km , obs ){
            if (!this.userId) {
                throw new Meteor.Error('not-authorized');
            }

            try {
                new SimpleSchema({
                    depenseId: {
                        type: String,
                        label: 'Depense ID',
                    },
                    dateTime: {
                        type: Date,
                        label: 'Date',
                    },
                    imm: {
                        type: String,
                        label: 'Immatriculation',
                        min : 3,
                        max : 5
                    },
                    dest: {
                        type: String,
                        label: 'Destination',
                        allowedValues: ['yaounde','douala'],
                    },
                    driver: {
                        type: String,
                        label: 'Chauffeur'
                    },
                    fuel: {
                        type: SimpleSchema.Integer,
                        label: 'Fuel',
                        max : 400
                    },
                    fdr: {
                        type: SimpleSchema.Integer,
                        label: 'FDR',
                    },
                    amount: {
                        type: SimpleSchema.Integer,
                        label: 'Prix place',
                    },
                    seats: {
                        type: SimpleSchema.Integer,
                        label: 'Nbr de places',
                    },
                    leasing: {
                        type: SimpleSchema.Integer,
                        label: 'Location',
                    },
                    km: {
                        type: SimpleSchema.Integer,
                        label: 'Kmtrage',
                    },
                    obs: {
                        type: String,
                        label: 'Observations',
                        min : 3,
                        max : 70,
                    }
                }).validate({depenseId, dateTime , imm , dest , driver , fuel, fdr , amount , seats , leasing ,km , obs});
            } catch (e) {
                throw new Meteor.Error(400, e.message);
            }

            Departs.insert({
                depenseId,
                dateTime : dateTime.getTime(),
                imm ,
                dest ,
                driver ,
                fuel,
                fdr ,
                amount ,
                seats ,
                leasing ,
                km ,
                obs,
                userId: this.userId,
                insertedAt : new Date().getTime(),
                visible: true,
            } , (err)=>{ if (!err)  { console.log(`Driver : ${driver} et Vehicule ${imm}`)} });
        },
        'departs.delete'(id) {
            Departs.remove(id);
        },
        'departs.modify'(_id, dateTime , imm , dest , driver ,fuel, fdr , amount , seats , leasing ,km , obs ) {
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
                imm: {
                    type: String,
                    label: 'Immatriculation',
                    min : 3,
                    max : 5
                },
                dest: {
                    type: String,
                    label: 'Destination',
                    allowedValues: ['yaounde','douala'],
                },
                driver: {
                    type: String,
                    label: 'Chauffeur'
                },
                fuel: {
                    type: SimpleSchema.Integer,
                    label: 'Fuel',
                    max : 250
                },
                fdr: {
                    type: SimpleSchema.Integer,
                    label: 'FDR',
                },
                amount: {
                    type: SimpleSchema.Integer,
                    label: 'Prix place',
                },
                seats: {
                    type: SimpleSchema.Integer,
                    label: 'Nbr de places',
                },
                leasing: {
                    type: SimpleSchema.Integer,
                    label: 'Location',
                },
                km: {
                    type: SimpleSchema.Integer,
                    label: 'Kmtrage',
                },
                obs: {
                    type: String,
                    label: 'Observations',
                    min : 3,
                    max : 70,
                }
            }).validate({ _id , dateTime , imm , dest , driver , fuel, fdr , amount , seats , leasing ,km , obs});

            Departs.update({
                _id
            }, {
                $set: {
                    dateTime : dateTime.getTime(),
                    imm ,
                    dest,
                    driver ,
                    fuel,
                    fdr ,
                    amount ,
                    seats ,
                    leasing ,
                    km ,
                    obs,
                    updatedAt : new Date().getTime(),
                    updatedUserId : this.userId
                }
            },(err)=>{ if (!err) { console.log(`Driver : ${driver} et Vehicule ${imm}`) } });
        }
    })

}
