import React from "react";
//import { Meteor } from "meteor/meteor";
import PropTypes from "prop-types";
import { Session } from "meteor/session";
import { createContainer } from "meteor/react-meteor-data";
import { Button } from "semantic-ui-react";
//import { filtrage, sommes } from "../api/fonctions";
import moment from "moment/moment";

const jsonexport = require("jsonexport");
const fileDownload = require("react-file-download");

export class DepartsExportData extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      departs: this.props.Session.get("departs") // Hum , ceci est a revoir.
    };
  }
  componentWillReceiveProps(nextProps) {
    this.setState({ departs: nextProps.getDeparts });
    //console.log(nextProps)
  }
  render() {
    return (
      <Button
        size="mini"
        onClick={() => {
          let data = this.state.departs.map(depart => {
            return {
              Date: moment(depart.dateTime).format("lll"),
              Immatriculation: `${depart.imm}.`,
              Chauffeur: depart.driver,
              Observations: depart.obs,
              Prix: depart.amount,
              Nbr_places: depart.seats,
              Brut:
                depart.leasing === 0
                  ? depart.amount * depart.seats
                  : depart.leasing,
              Carburant_litres: depart.fuel,
              Carburant_CFA: depart.fuel * 635,
              FDR: depart.fdr,
              SAB : (!!depart.eau ? depart.eau : 0) * 116.6 +
              (!!depart.cafe ? depart.cafe : 0) * 144.1 +
              (!!depart.the ? depart.the : 0) * 17.92 +
              (!!depart.sucre ? depart.sucre : 0) * 0 +
              (!!depart.cuillere ? depart.cuillere : 0) * 6.75 +
              (!!depart.gobelet ? depart.gobelet : 0) * 0 +
              (!!depart.couvercle ? depart.couvercle : 0) * 0 +
              (!!depart.sandwich ? depart.sandwich : 0) * 300 +
              (!!depart.croissant ? depart.croissant : 0) * 250 +
              (!!depart.choco ? depart.choco : 0) * 250 +
              (!!depart.biscuit ? depart.biscuit : 0) * 50 +
              (!!depart.mouchoir ? depart.mouchoir : 0) * 0,
/*              eau_QTT: !!depart.eau ? depart.eau : 0,
              eau_CFA: (!!depart.eau ? depart.eau : 0) * 100,
              cafe_QTT: !!depart.cafe ? depart.cafe : 0,
              cafe_CFA: (!!depart.cafe ? depart.cafe : 0) * 144.1,
              the_QTT: !!depart.the ? depart.the : 0,
              the_CFA: (!!depart.the ? depart.the : 0) * 17.92,
              sucre_QTT: !!depart.sucre ? depart.sucre : 0,
              sucre_CFA: (!!depart.sucre ? depart.sucre : 0) * 0,
              cuillere_QTT: !!depart.cuillere ? depart.cuillere : 0,
              cuillere_CFA: (!!depart.cuillere ? depart.cuillere : 0) * 6.75,
              gobelet_QTT: !!depart.gobelet ? depart.gobelet : 0,
              gobelet_CFA: (!!depart.gobelet ? depart.gobelet : 0) * 0,
              couvercle_QTT: !!depart.couvercle ? depart.couvercle : 0,
              couvercle_CFA: (!!depart.couvercle ? depart.couvercle : 0) * 0,
              sandwich_QTT: !!depart.sandwich ? depart.sandwich : 0,
              sandwich_CFA: (!!depart.sandwich ? depart.sandwich : 0) * 300,
              croissant_QTT: !!depart.croissant ? depart.croissant : 0,
              croissant_CFA: (!!depart.croissant ? depart.croissant : 0) * 250,
              choco_QTT: !!depart.choco ? depart.choco : 0,
              choco_CFA: (!!depart.choco ? depart.choco : 0) * 250,
              biscuit_QTT: !!depart.biscuit ? depart.biscuit : 0,
              biscuit_CFA: (!!depart.biscuit ? depart.biscuit : 0) * 50,
              mouchoir_QTT: !!depart.mouchoir ? depart.mouchoir : 0,
              mouchoir_CFA: (!!depart.mouchoir ? depart.mouchoir : 0) * 0,
              Total_depenses:
                depart.fuel * 635 +
                depart.fdr +
                (!!depart.eau ? depart.eau : 0) * 100 +
                (!!depart.cafe ? depart.cafe : 0) * 144.1 +
                (!!depart.the ? depart.the : 0) * 17.92 +
                (!!depart.sucre ? depart.sucre : 0) * 0 +
                (!!depart.cuillere ? depart.cuillere : 0) * 6.75 +
                (!!depart.gobelet ? depart.gobelet : 0) * 0 +
                (!!depart.couvercle ? depart.couvercle : 0) * 0 +
                (!!depart.sandwich ? depart.sandwich : 0) * 300 +
                (!!depart.croissant ? depart.croissant : 0) * 250 +
                (!!depart.choco ? depart.choco : 0) * 250 +
                (!!depart.biscuit ? depart.biscuit : 0) * 50 +
                (!!depart.mouchoir ? depart.mouchoir : 0) * 0, */
              Net: Math.round(
                (depart.leasing === 0
                  ? depart.amount * depart.seats
                  : depart.leasing) -
                  (depart.fuel * 635 +
                    depart.fdr +
                    (!!depart.eau ? depart.eau : 0) * 100 +
                    (!!depart.cafe ? depart.cafe : 0) * 144.1 +
                    (!!depart.the ? depart.the : 0) * 17.92 +
                    (!!depart.sucre ? depart.sucre : 0) * 0 +
                    (!!depart.cuillere ? depart.cuillere : 0) * 6.75 +
                    (!!depart.gobelet ? depart.gobelet : 0) * 0 +
                    (!!depart.couvercle ? depart.couvercle : 0) * 0 +
                    (!!depart.sandwich ? depart.sandwich : 0) * 300 +
                    (!!depart.croissant ? depart.croissant : 0) * 250 +
                    (!!depart.choco ? depart.choco : 0) * 250 +
                    (!!depart.biscuit ? depart.biscuit : 0) * 50 +
                    (!!depart.mouchoir ? depart.mouchoir : 0) * 0)
              )
            };
          });
          if (!!data) {
            let csv = Papa.unparse(data);
            let blob = new Blob([csv], { type: "text/csv;charset=utf-8" });
            fileDownload(blob, "filename.csv");
          } else {
            Bert.alert(
              "erreur inatendue reessayez.",
              "danger",
              "growl-top-right",
              "fa-close"
            );
          }
        }}
      >
        <Button.Content>Export CSV</Button.Content>
      </Button>
    );
  }
}

DepartsExportData.propTypes = {
  getDeparts: PropTypes.array
};

export default createContainer(() => {
  const getDeparts = Session.get("departsFiltered");

  return {
    Session,
    getDeparts
  };
}, DepartsExportData);
