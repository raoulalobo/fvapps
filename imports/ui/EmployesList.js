import React from 'react';
import PropTypes from 'prop-types';
import { Meteor } from 'meteor/meteor';
import { Session } from 'meteor/session';
import { createContainer } from 'meteor/react-meteor-data';
import { Table } from 'semantic-ui-react'


import { filtrageEmployes } from '../api/fonctions';
import { Employes } from '../api/employes';

import DepartsEmptyListItem from './DepartsEmptyListItem';
import EmployesListItem from './EmployesListItem';
//import moment from "moment/moment";


export class EmployesList extends React.Component{
    componentDidMount() {

    }
    componentWillReceiveProps(nextProps) {
        const { employes, employeStartedDate, employeEndedDate, searchNom, searchService, searchAssurance, searchContrat } = nextProps;

        this.props.Session.set('employes', employes);

        // Filtre
        const filtreMultipleEmployes = filtrageEmployes( employes, employeStartedDate, employeEndedDate, searchNom, searchService, searchAssurance, searchContrat);
        this.props.Session.set('employesFiltered', filtreMultipleEmployes);

    }
    componentWillUnmount() {
        Meteor.subscribe('employes').stop();
    }
    render(){
        return (
            <div>
                <Table selectable singleLine>
                    <Table.Header>
                        <Table.Row>
                            <Table.HeaderCell/>
                            <Table.HeaderCell>Noms</Table.HeaderCell>
                            <Table.HeaderCell>Salaire</Table.HeaderCell>
                            <Table.HeaderCell>CNI</Table.HeaderCell>
                            <Table.HeaderCell>Date_embauche</Table.HeaderCell>
                            <Table.HeaderCell>Contrat</Table.HeaderCell>
                            <Table.HeaderCell>Assurance</Table.HeaderCell>
                            <Table.HeaderCell>Service</Table.HeaderCell>
                        </Table.Row>
                    </Table.Header>

                    <Table.Body>
                        { this.props.employes.length === 0 ? <DepartsEmptyListItem text="No Items, if is an unexpected result please contact the admin"/> : undefined }
                        { this.props.loading && !!this.props.employes.length ? <DepartsEmptyListItem text="Loading Data , please wait ..."/>  : undefined }
                        {!!this.props.employes.length && !this.props.loading ? ( this.props.Session.get('employesFiltered')  ).map( (employe) => { return <EmployesListItem key={employe._id} employe={employe}/>; } ) : undefined }

                    </Table.Body>
                </Table>
            </div>
        );
    }
};

EmployesList.propTypes = {
    employes: PropTypes.array
};

export default createContainer(() => {


    const searchNom = Session.get('searchNom') || undefined ;
    const searchService = Session.get('searchService') || undefined ;
    const searchAssurance = Session.get('searchAssurance') || undefined ;
    const searchContrat = Session.get('searchContrat') || undefined ;
    const employeStartedDate = Session.get('employeStartedDate') || new Date().setHours(0, 0, 0, 0) ;
    const employeEndedDate = Session.get('employeEndedDate') || new Date().setHours(23, 59, 0, 0) ;

    //const employesHandle = Meteor.subscribe('employes',employeStartedDate,employeEndedDate);
    const employesHandle = Meteor.subscribe('employes.autre');
    const loading = !employesHandle.ready();

    return {
        Session,
        loading,
        searchNom,
        searchService,
        searchAssurance,
        searchContrat,
        employeStartedDate,
        employeEndedDate,
        employes : Employes.find({visible: true}).fetch().map((employe)=>{
            return {
                ...employe,
            }
        })
    };
}, EmployesList);
