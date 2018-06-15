import SimpleSchema from "simpl-schema";
import { Meteor } from "meteor/meteor";
import { Mongo } from "meteor/mongo";

const insertion = new SimpleSchema({
  depenseId: {
    type: String,
    label: "Depense ID"
  },
  dateTime: {
    type: Date,
    label: "Date"
  },
  imm: {
    type: String,
    label: "Immatriculation",
    min: 3,
    max: 5
  },
  dest: {
    type: String,
    label: "Destination",
    allowedValues: ["yaounde", "douala"]
  },
  driver: {
    type: String,
    label: "Chauffeur"
  },
  fuel: {
    type: SimpleSchema.Integer,
    label: "Fuel",
    max: 400
  },
  fdr: {
    type: SimpleSchema.Integer,
    label: "FDR"
  },
  amount: {
    type: SimpleSchema.Integer,
    label: "Prix place"
  },
  seats: {
    type: SimpleSchema.Integer,
    label: "Nbr de places"
  },
  leasing: {
    type: SimpleSchema.Integer,
    label: "Location"
  },
  km: {
    type: SimpleSchema.Integer,
    label: "Kmtrage"
  },
  eau: {
    type: SimpleSchema.Integer,
    label: "Eau"
  },
  cafe: {
    type: SimpleSchema.Integer,
    label: "Cafe"
  },
  the: {
    type: SimpleSchema.Integer,
    label: "The"
  },
  sucre: {
    type: SimpleSchema.Integer,
    label: "Sucre"
  },
  cuillere: {
    type: SimpleSchema.Integer,
    label: "Cueillere"
  },
  gobelet: {
    type: SimpleSchema.Integer,
    label: "Gobelet"
  },
  couvercle: {
    type: SimpleSchema.Integer,
    label: "Couvercle"
  },
  sandwich: {
    type: SimpleSchema.Integer,
    label: "Sandwich"
  },
  croissant: {
    type: SimpleSchema.Integer,
    label: "Croissants, Biscuits ..."
  },
  choco: {
    type: SimpleSchema.Integer,
    label: "Pain chocos"
  },
  biscuit: {
    type: SimpleSchema.Integer,
    label: "Biscuits"
  },
  mouchoir: {
    type: SimpleSchema.Integer,
    label: "Mouchoir"
  },
  obs: {
    type: String,
    label: "Observations",
    min: 3,
    max: 70
  }
});

const modification = new SimpleSchema({
  _id: {
    type: String,
    label: "_id"
  }
});

modification.extend(insertion);

export const Departs = new Mongo.Collection("departs");

if (Meteor.isServer) {
  Meteor.publish("departs", function(dateStart, dateEnd) {
    return Departs.find({ dateTime: { $gte: dateStart, $lte: dateEnd } });
  });

  Meteor.publish("departsVidanges", function() {
    return Departs.find({});
  });

  Meteor.methods({
    "departs.insert"(
      depenseId,
      dateTime,
      imm,
      dest,
      driver,
      fuel,
      fdr,
      amount,
      seats,
      leasing,
      km,
      eau,
      cafe,
      the,
      sucre,
      cuillere,
      gobelet,
      couvercle,
      sandwich,
      croissant,
      choco,
      biscuit,
      mouchoir,
      obs
    ) {
      if (!this.userId) {
        throw new Meteor.Error("not-authorized");
      }

      try {
        insertion.validate({
          depenseId,
          dateTime,
          imm,
          dest,
          driver,
          fuel,
          fdr,
          amount,
          seats,
          leasing,
          km,
          eau,
          cafe,
          the,
          sucre,
          cuillere,
          gobelet,
          couvercle,
          sandwich,
          croissant,
          choco,
          biscuit,
          mouchoir,
          obs
        });
      } catch (e) {
        throw new Meteor.Error(400, e.message);
      }

      Departs.insert(
        {
          depenseId,
          dateTime: dateTime.getTime(),
          imm,
          dest,
          driver,
          fuel,
          fdr,
          amount,
          seats,
          leasing,
          km,
          eau,
          cafe,
          the,
          sucre,
          cuillere,
          gobelet,
          couvercle,
          sandwich,
          croissant,
          choco,
          biscuit,
          mouchoir,
          obs,
          userId: this.userId,
          insertedAt: new Date().getTime(),
          visible: true
        },
        err => {
          if (!err) {
            console.log(`Driver : ${driver} et Vehicule ${imm}`);
          }
        }
      );
    },
    "departs.delete"(id) {
      Departs.remove(id);
    },
    "departs.modify"(
      _id,
      dateTime,
      imm,
      dest,
      driver,
      fuel,
      fdr,
      amount,
      seats,
      leasing,
      km,
      eau,
      cafe,
      the,
      sucre,
      cuillere,
      gobelet,
      couvercle,
      sandwich,
      croissant,
      choco,
      biscuit,
      mouchoir,
      obs
    ) {
      if (!this.userId) {
        throw new Meteor.Error("not-authorized");
      }

      new SimpleSchema({
        _id: {
          type: String,
          label: "_id"
        },
        dateTime: {
          type: Date,
          label: "Date"
        },
        imm: {
          type: String,
          label: "Immatriculation",
          min: 3,
          max: 5
        },
        dest: {
          type: String,
          label: "Destination",
          allowedValues: ["yaounde", "douala"]
        },
        driver: {
          type: String,
          label: "Chauffeur"
        },
        fuel: {
          type: SimpleSchema.Integer,
          label: "Fuel",
          max: 400
        },
        fdr: {
          type: SimpleSchema.Integer,
          label: "FDR"
        },
        amount: {
          type: SimpleSchema.Integer,
          label: "Prix place"
        },
        seats: {
          type: SimpleSchema.Integer,
          label: "Nbr de places"
        },
        leasing: {
          type: SimpleSchema.Integer,
          label: "Location"
        },
        km: {
          type: SimpleSchema.Integer,
          label: "Kmtrage"
        },
        eau: {
          type: SimpleSchema.Integer,
          label: "Eau"
        },
        cafe: {
          type: SimpleSchema.Integer,
          label: "Cafe"
        },
        the: {
          type: SimpleSchema.Integer,
          label: "The"
        },
        sucre: {
          type: SimpleSchema.Integer,
          label: "Sucre"
        },
        cuillere: {
          type: SimpleSchema.Integer,
          label: "Cueillere"
        },
        gobelet: {
          type: SimpleSchema.Integer,
          label: "Gobelet"
        },
        couvercle: {
          type: SimpleSchema.Integer,
          label: "Couvercle"
        },
        sandwich: {
          type: SimpleSchema.Integer,
          label: "Sandwich"
        },
        croissant: {
          type: SimpleSchema.Integer,
          label: "Croissants, Biscuits ..."
        },
        choco: {
          type: SimpleSchema.Integer,
          label: "Pain chocos"
        },
        biscuit: {
          type: SimpleSchema.Integer,
          label: "Biscuits"
        },
        mouchoir: {
          type: SimpleSchema.Integer,
          label: "Mouchoir"
        },
        obs: {
          type: String,
          label: "Observations",
          min: 3,
          max: 70
        }
      }).validate({
        _id,
        dateTime,
        imm,
        dest,
        driver,
        fuel,
        fdr,
        amount,
        seats,
        leasing,
        km,
        eau,
        cafe,
        the,
        sucre,
        cuillere,
        gobelet,
        couvercle,
        sandwich,
        croissant,
        choco,
        biscuit,
        mouchoir,
        obs
      });

      Departs.update(
        {
          _id
        },
        {
          $set: {
            dateTime: dateTime.getTime(),
            imm,
            dest,
            driver,
            fuel,
            fdr,
            amount,
            seats,
            leasing,
            km,
            eau,
            cafe,
            the,
            sucre,
            cuillere,
            gobelet,
            couvercle,
            sandwich,
            croissant,
            choco,
            biscuit,
            mouchoir,
            obs,
            updatedAt: new Date().getTime(),
            updatedUserId: this.userId
          }
        },
        err => {
          if (!err) {
            console.log(`Driver : ${driver} et Vehicule ${imm}`);
          }
        }
      );
    }
  });
}
