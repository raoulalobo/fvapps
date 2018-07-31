import React from "react";
import PropTypes from "prop-types";
import { Meteor } from "meteor/meteor";
import { Session } from "meteor/session";
import { createContainer } from "meteor/react-meteor-data";
import { Table } from "semantic-ui-react";
import { Sorties } from "../api/sorties";
import EmptyTableItem from "./EmptyTableItem";
import SortiesListItem from "./SortiesListItem";
import { recus , sommeSorties } from "../api/fonctions";


export class SortiesList extends React.Component {
  componentDidMount() {}
  componentWillReceiveProps(nextProps) {

    const { sorties } = nextProps;
    this.props.Session.set("sorties", sorties);

    // Filtre
    const recu = recus( sorties );
    this.props.Session.set("recu", recu);

  }
  componentWillUnmount() {
    Meteor.subscribe("Sorties").stop();
  }
  render() {
    return (
        <div>
          <Table selectable singleLine>
            <Table.Header>
              <Table.Row>
                <Table.HeaderCell />
                
                <Table.HeaderCell>Date_Heure</Table.HeaderCell>
                <Table.HeaderCell>Designation</Table.HeaderCell>
                <Table.HeaderCell>Ordre</Table.HeaderCell>
                <Table.HeaderCell>Demandeur</Table.HeaderCell>
                <Table.HeaderCell>Libelle</Table.HeaderCell>
                <Table.HeaderCell>Montant</Table.HeaderCell>
                
              </Table.Row>
            </Table.Header>

            <Table.Body>
              {this.props.sorties.length === 0 ? (
                  <EmptyTableItem text="No Items, if is an unexpected result please contact the admin" />
              ) : (
                  undefined
              )}
              {this.props.loading && !!this.props.sorties.length ? (
                  <EmptyTableItem text="Loading Data , please wait ..." />
              ) : (
                  undefined
              )}
              {!!this.props.sorties.length && !this.props.loading
                  ? this.props.Session.get("sorties").map(sortie => {
                    return <SortiesListItem key={sortie._id} sortie={sortie} />;
                  })
                  : undefined}
            </Table.Body>
          </Table>
        </div>
    );
  }
}

SortiesList.propTypes = {
  Sorties: PropTypes.array
};

export default createContainer(() => {

  const searchRecu = Session.get('searchRecu') || '' ;
  const searchCode = Session.get('searchCode') || '' ;
  const searchLibelle = Session.get('searchLibelle') || '' ;
  const searchDesignation = Session.get('searchDesignation') || '' ;
  const SortieStartedDate = Session.get('sortieStartedDate') || new Date().setHours(0, 0, 0, 0);
  const SortieEndedDate = Session.get('sortieEndedDate') || new Date().setHours(23, 59, 0, 0);

  const SortiesHandle = Meteor.subscribe("sortiesParDate", SortieStartedDate, SortieEndedDate, searchRecu , searchCode , searchLibelle, searchDesignation );
  const loading = !SortiesHandle.ready();

  return {
    Session,
    loading,
    //searchDesignation,
    //searchLibelle,
    sorties: Sorties.find({ visible: true })
        .fetch()
        .map(sortie => {
          return {
            ...sortie
          };
        })
  };
}, SortiesList);
