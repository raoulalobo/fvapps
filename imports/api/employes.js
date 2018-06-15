import SimpleSchema from 'simpl-schema';
import { Meteor } from 'meteor/meteor';
import { Mongo } from 'meteor/mongo';
import {Departs} from "./departs";

const insertion = new SimpleSchema({

    nom: {
        type: String,
        label: `Nom et prenom`,
    },
    bday: {
        type: Date,
        label: `Date de naissance`,
    },
    cni: {
        type: String,
        label: `CNI`
    },
    phone: {
        type: String,
        label: `Telephone`
    },
    scan: {
        type: String,
        label: `Scan`
    },
    enfants: {
        type: SimpleSchema.Integer,
        label: `Nbr d'enfants`
    },
    embauche: {
        type: Date,
        label: `Date embauche`,
    },
    contrat: {
        type: String,
        label: `Type de contrat`,
    },
    assurance: {
        type: String,
        label: `Type d'assurance`,
    },
    service: {
        type: String,
        label: `Service`,
    },
    salaire: {
        type: SimpleSchema.Integer,
        label: `Salaire`
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

export const Employes = new Mongo.Collection('employes');



if ( Meteor.isServer ) {

    Meteor.publish('employes', function(dateStart, dateEnd ) {
        return Employes.find({ embauche: { $gte: dateStart , $lte: dateEnd } });
    });

    Meteor.publish('employes.autre', function() {
        return Employes.find({});
    });

    Meteor.methods({
        'employes.unique'( value){
            if ( !this.userId ) {
                throw new Meteor.Error('not-authorized');
            }
            return Employes.find({code: value })
        },
        'employes.insert'( nom, bday, cni, phone, scan, enfants, embauche, contrat, assurance, service, salaire , observations){
            if ( !this.userId ) {
                throw new Meteor.Error('not-authorized');
            }

            try {
                insertion.validate({  nom, bday, cni, phone, scan, enfants, embauche, contrat, assurance, service, salaire, observations });
            } catch (e) {
                throw new Meteor.Error(400, e.message);
            }

            return Employes.insert({

                nom,
                bday : bday.getTime(),
                cni,
                phone,
                scan,
                enfants,
                embauche : embauche.getTime(),
                contrat,
                assurance,
                service,
                salaire,
                observations,
                creeLe: this.userId,
                creePar : new Date().getTime(),
                visible: true,
            } , (err,id)=>{ if (!err)
            { console.log(`Employe : nom ${nom} , contrat : ${contrat}`)}

            });
        },
        'employes.modify'( _id, nom, bday, cni, phone, scan, enfants, embauche, contrat, assurance, service, salaire, observations ) {
            if ( !this.userId ) {
                throw new Meteor.Error('not-authorized');
            }

            try {
                modification.validate({ _id , nom, bday, cni, phone, scan, enfants, embauche, contrat, assurance, service, salaire, observations });
            } catch (e) {
                throw new Meteor.Error(400, e.message);
            }


            Employes.update({
                _id
            }, {
                $set: {
                    nom, bday, cni, phone, scan, enfants, embauche, contrat, assurance, service, salaire, observations,
                    modifieLe : new Date().getTime(),
                    modifiePar : this.userId
                }
            },(err)=>{ if (!err) { console.log(` Type prestation : ${_id} modifie le ${ new Date().getTime() }`) } });
        },
        'employes.delete'(id) {
            if ( !this.userId ) {
                throw new Meteor.Error('not-authorized');
            }
            Employes.remove(id);
        }
    })

}
