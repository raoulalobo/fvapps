import SimpleSchema from 'simpl-schema';
import { Meteor } from 'meteor/meteor';
import { Mongo } from 'meteor/mongo';

const insertion = new SimpleSchema({

  code_sortie: {
    type: String,
    label: 'Code sortie',
    // uuid()
  },
  date_sortie: {
    type: Date,
    label: 'Date de depense',
  },
  libelle: {
    type: String,
    label: 'libelle / immatriculation',
  },
  demandeur: {
    type: String,
    label: 'Demandeur',
  },
  ordonnateur: {
    type: String,
    label: 'Ordonnateur',
  },
  montant: {
    type: SimpleSchema.Integer,
    label: "Montant"
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

export const Sorties = new Mongo.Collection('sorties');



if ( Meteor.isServer ) {


  Meteor.publish('sortiesParDate', function(dateStart, dateEnd, recu , cod, lib , des ) {

    return Sorties.find({
      date_sortie: { $gte: dateStart , $lte: dateEnd } ,
      retour: { $regex: recu,$options:"$i" } ,
      code_sortie: { $regex: cod,$options:"$i" } ,
      libelle: { $regex: lib,$options:"$i" } ,
      'factures.designation': { $regex: des,$options:"$i" }
    });

  });


  Meteor.publish('sorties', function() {

    return Sorties.find({
      instock: { $elemMatch: { qty: { $gt: 10, $lte: 20 } } }
    });

  });

  Meteor.methods({
    'sorties.insert'(  code_sortie , date_sortie , libelle , demandeur  , ordonnateur , factures , montant, observations ){
      if ( !this.userId ) {
        throw new Meteor.Error('not-authorized');
      }

      try {
        insertion.validate({ code_sortie , date_sortie , libelle , demandeur  , ordonnateur , montant , observations });
      } catch (e) {
        throw new Meteor.Error(400, e.message);
      }

      return Sorties.insert({

        code_sortie ,
        date_sortie : date_sortie.getTime() ,
        libelle ,
        demandeur  ,
        ordonnateur ,
        factures ,
        montant,
        observations,
        creeLe: this.userId,
        creePar : new Date().getTime(),
        retour: 'non',
        visible: true,
      } , (err,id)=>{ if (!err)
      { console.log(`sortie ${code_sortie} faite le : ${date_sortie}`)}

      });
    },
    'sorties.modify'( id , code_sortie , date_sortie , libelle , demandeur  , ordonnateur , factures , observations ) {
      if ( !this.userId ) {
        throw new Meteor.Error('not-authorized');
      }

      modification.validate({ id ,ordre , immatriculation, dateTime , type , nbrVoyageSimple ,kilometrage , observations });

      Sorties.update({
        _id : id
      }, {
        $set: {
          date_sortie : dateTime.getTime() ,
          libelle ,
          demandeur  ,
          ordonnateur ,
          factures ,
          observations,
          modifieLe : new Date().getTime(),
          modifiePar : this.userId
        }
      },(err)=>{ if (!err) { console.log(`La sortie ${libelle} a ete modifie`) } });
    },
    'sorties.retour'( id ) {
      if ( !this.userId ) {
        throw new Meteor.Error('not-authorized');
      }


      Sorties.update({
        _id : id
      }, {
        $set: {
          modifieLe : new Date().getTime(),
          modifiePar : this.userId,
          retour: 'oui',
        }
      },(err)=>{ if (!err) { console.log(`La depense ${_id} a ete modifie`) } });
    },
    'sorties.delete'(id) {
      if ( !this.userId ) {
        throw new Meteor.Error('not-authorized');
      }
      Sorties.remove(id);
    }
  })

}
