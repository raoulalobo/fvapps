import React from "react";
import { Meteor } from "meteor/meteor";
import PropTypes from "prop-types";
import { Session } from "meteor/session";
import { createContainer } from "meteor/react-meteor-data";
import { Button } from "semantic-ui-react";
const jsonexport = require("jsonexport");
const fileDownload = require("react-file-download");
import { filtrage, sommes } from "../api/fonctions";
import moment from "moment/moment";

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
              Total_depenses: depart.fuel * 635 + depart.fdr,
              Net:
                depart.leasing === 0
                  ? depart.amount * depart.seats
                  : depart.leasing - (depart.fuel * 635 + depart.fdr)
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
