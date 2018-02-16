import React from 'react';
import PropTypes from 'prop-types';
import { Meteor } from 'meteor/meteor';
import { Session } from 'meteor/session';
import { createContainer } from 'meteor/react-meteor-data';
import { Table } from 'semantic-ui-react'


import { filtrage } from '../api/fonctions';
import { Departs } from '../api/departs';

import DepartsEmptyListItem from './DepartsEmptyListItem';
import DepartsListItem from './DepartsListItem';
import moment from "moment/moment";


export class DepartsList extends React.Component{
    componentDidMount() {

    }
    componentWillReceiveProps(nextProps) {
        const { departs, searchClasse, searchVille, searchBus, searchHotesse } = nextProps;

        this.props.Session.set('departs', departs);

        // Filtre
        const filtreMultipleDeparts = filtrage(departs,searchClasse,searchVille,searchBus,searchHotesse);
        this.props.Session.set('departsFiltered', filtreMultipleDeparts);

    }
    componentWillUnmount() {
        Meteor.subscribe('departs').stop();
    }
    render(){
        return (
            <div>
                <Table selectable singleLine>
                    <Table.Header>
                        <Table.Row>
                            <Table.HeaderCell/>
                            <Table.HeaderCell>Date_Heure</Table.HeaderCell>
                            <Table.HeaderCell>Imm</Table.HeaderCell>
                            <Table.HeaderCell>Chauffeur</Table.HeaderCell>
                            <Table.HeaderCell>Carburant</Table.HeaderCell>
                            <Table.HeaderCell>FDR</Table.HeaderCell>
                            <Table.HeaderCell>Prix place</Table.HeaderCell>
                            <Table.HeaderCell>nbr de places</Table.HeaderCell>
                            <Table.HeaderCell>Total</Table.HeaderCell>
                            <Table.HeaderCell>Destination</Table.HeaderCell>
                            <Table.HeaderCell>Observations</Table.HeaderCell>
                        </Table.Row>
                    </Table.Header>

                    <Table.Body>
                        { this.props.departs.length === 0 ? <DepartsEmptyListItem text="No Items, if is an unexpected result please contact the admin"/> : undefined }
                        { this.props.loading && !!this.props.departs.length ? <DepartsEmptyListItem text="Loading Data , please wait ..."/>  : undefined }
                        {!!this.props.departs.length && !this.props.loading ? ( this.props.Session.get('departsFiltered')  ).map( (depart) => { return <DepartsListItem key={depart._id} depart={depart}/>; } ) : undefined }

                    </Table.Body>
                </Table>
            </div>
        );
    }
};

DepartsList.propTypes = {
    departs: PropTypes.array
};

export default createContainer(() => {


    const searchHotesse = Session.get('searchHotesse') || undefined ;
    const searchClasse = Session.get('searchClasse') || undefined ;
    const searchVille = Session.get('searchVille') || undefined ;
    const searchBus = Session.get('searchBus') || undefined ;
    const departStartedDate = Session.get('departStartedDate') || new Date().setHours(0, 0, 0, 0) ;
    const departEndedDate = Session.get('departEndedDate') || new Date().setHours(23, 59, 0, 0) ;

    const departsHandle = Meteor.subscribe('departs',departStartedDate,departEndedDate);
    const loading = !departsHandle.ready();

    return {
        Session,
        loading,
        searchHotesse,
        searchClasse,
        searchVille,
        searchBus,
        departs : Departs.find({visible: true}).fetch().map((depart)=>{
            return {
                departDate : moment(depart.dateTime).format('lll'),
                ...depart,
                classe: depart.amount > 4000 ? 'VIP' : 'Classique',
                total :  depart.leasing === 0 ? depart.amount * depart.seats : depart.leasing
            }
        })
    };
}, DepartsList);
