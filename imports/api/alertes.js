import SimpleSchema from 'simpl-schema';
import { Meteor } from 'meteor/meteor';
import { Mongo } from 'meteor/mongo';
import {Departs} from "./departs";

const insertion = new SimpleSchema({

    type: {
        type: String,
        label: `Type`,
    },
    code: {
        type: String,
        label: `Code ( Numero ) `
    },
    immatriculation: {
        type: String,
        label: `Immatriculation`
    },
    validite: {
        type: Date,
        label: `Date validite`,
    },
    observations: {
        type: String,
        label: 'Observations',
        min: 3,
        max: 70,
    }
});

const modification = new SimpleSchema({
    _id: {
        type: String,
        label: '_id',
    }
});

modification.extend(insertion);

export const Alertes = new Mongo.Collection('alertes');



if ( Meteor.isServer ) {

    Meteor.publish('alertes', function(dateStart, dateEnd ) {
        return Alertes.find({ validite: { $gte: dateStart , $lte: dateEnd } });
    });

    Meteor.publish('alertes.autre', function() {
        return Alertes.find({});
    });

    Meteor.methods({
        'alertes.unique'( value){
            if ( !this.userId ) {
                throw new Meteor.Error('not-authorized');
            }
            return Alertes.find({code: value })
        },
        'alertes.insert'( type, code, immatriculation, validite , observations){
            if ( !this.userId ) {
                throw new Meteor.Error('not-authorized');
            }

            try {
                insertion.validate({  type, code, immatriculation, validite , observations });
            } catch (e) {
                throw new Meteor.Error(400, e.message);
            }

            return Alertes.insert({

                type,
                code,
                immatriculation,
                validite : validite.getTime(),
                observations,
                creeLe: this.userId,
                creePar : new Date().getTime(),
                visible: true,
            } , (err,id)=>{ if (!err)
            { console.log(`Alerte : Type ${type} , Imm : ${immatriculation}`)}

            });
        },
        'alertes.modify'( _id, type, code, immatriculation, validite , observations ) {
            if ( !this.userId ) {
                throw new Meteor.Error('not-authorized');
            }

            try {
                modification.validate({ _id , type, code, immatriculation, validite , observations });
            } catch (e) {
                throw new Meteor.Error(400, e.message);
            }


            Alertes.update({
                _id
            }, {
                $set: {
                    type , code, immatriculation, validite , observations,
                    modifieLe : new Date().getTime(),
                    modifiePar : this.userId
                }
            },(err)=>{ if (!err) { console.log(` Alerte Type ${type} , Imm : ${immatriculation}, modifie le ${ new Date().getTime() }`) } });
        },
        'alertes.false'( _id ) {
            if ( !this.userId ) {
                throw new Meteor.Error('not-authorized');
            }

            Alertes.update({
                _id
            }, {
                $set: {
                    modifieLe : new Date().getTime(),
                    modifiePar : this.userId,
                    visible: false,
                }
            },(err)=>{ if (!err) { console.log(` Alerte Type ${type} , Imm : ${immatriculation}, modifie FALSE le ${ new Date().getTime() }`) } });
        },
        'alertes.delete'(id) {
            if ( !this.userId ) {
                throw new Meteor.Error('not-authorized');
            }
            Alertes.remove(id);
        }
    })

}
