import SimpleSchema from 'simpl-schema';
import { Meteor } from 'meteor/meteor';
import { Mongo } from 'meteor/mongo';


//import request from 'request';


export const Hotesses = new Mongo.Collection('hotesses');
export const Sales = new Mongo.Collection('sales');

if ( Meteor.isServer ) {
    Meteor.publish('hotessesss', function(dateStart, dateEnd ) {
        return Hotesses.find({ dateTime: { $gte: dateStart , $lte: dateEnd } });
    });

    Meteor.publish('hotesses', function() {
        return Hotesses.find({});
    });

    Meteor.methods({
        'parseUpload'( data ){
            check( data, Array );

            for ( let i = 0; i < data.length; i++ ) {
                let item   = data[ i ],
                    exists = Sales.findOne( { saleId: item.saleId } );

                if ( !exists ) {
                    Sales.insert( item );
                } else {
                    console.warn( 'Rejected. This item already exists.' );
                }
            }
        },
        'hotesses.insert'(dateTime , nom , cni , phone1 , phone2 , permis , obs ){
            if (!this.userId) {
                throw new Meteor.Error('not-authorized');
            }

            try {
                new SimpleSchema({
                    dateTime: {
                        type: Date,
                        label: 'Date',
                    },
                    nom: {
                        type: String,
                        label: 'Nom et prenom',
                    },
                    cni: {
                        type: String,
                        label: 'CNI',
                    },
                    phone1: {
                        type: String,
                        label: 'Telephone #1'
                    },
                    phone2: {
                        type: String,
                        label: 'Telephone #2',
                    },
                    permis: {
                        type: String,
                        label: 'Permis de conduire',
                    },
                    obs: {
                        type: String,
                        label: 'Observations',
                        min : 3,
                        max : 70,
                    }
                }).validate({dateTime , nom , cni , phone1 , phone2 , permis , obs});
            } catch (e) {
                throw new Meteor.Error(400, e.message);
            }

            Hotesses.insert({
                dateTime : dateTime.getTime(),
                nom ,
                cni ,
                phone1 ,
                phone2 ,
                permis ,
                obs,
                userId: this.userId,
                insertedAt : new Date().getTime(),
                visible: true,
            } , (err)=>{ if (!err)  { console.log(`Hotesse phone : ${phone1} et nom ${nom}`)} });
        },
        'hotesses.delete'(id) {
            Hotesses.remove(id);
        },
        'hotesses.modify'(_id, dateTime , nom , cni , phone1 , phone2 , permis , obs ) {
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
                nom: {
                    type: String,
                    label: 'Nom et prenom',
                },
                cni: {
                    type: String,
                    label: 'CNI',
                },
                phone1: {
                    type: String,
                    label: 'Telephone #1'
                },
                phone2: {
                    type: String,
                    label: 'Telephone #2',
                },
                permis: {
                    type: String,
                    label: 'Permis de conduire',
                },
                obs: {
                    type: String,
                    label: 'Observations',
                    min : 3,
                    max : 70,
                }
            }).validate({ _id , dateTime , nom , cni , phone1 , phone2 , permis , obs});

            Hotesses.update({
                _id
            }, {
                $set: {
                    dateTime : dateTime.getTime(),
                    nom ,
                    cni,
                    phone1 ,
                    phone2 ,
                    permis ,
                    obs,
                    updatedAt : new Date().getTime(),
                    updatedUserId : this.userId
                }
            },(err)=>{ if (!err) { console.log(`Driver : ${phone1} et Vehicule ${nom}`) } });
        }
    })

}
