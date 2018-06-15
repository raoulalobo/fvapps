const _ = require('lodash');
const R = require('ramda');
import moment from 'moment';

import React from 'react';
import PropTypes from 'prop-types';
import { Meteor } from 'meteor/meteor';
import { Session } from 'meteor/session';
import { createContainer } from 'meteor/react-meteor-data';
import { Table } from 'semantic-ui-react';

import {filtreAlerte} from '../api/fonctions';

import { Alertes } from '../api/alertes';

import EmptyTableItem from './EmptyTableItem';
import AlertesListItem from './AlertesListItem';


export class AlertesList extends React.Component{
    componentDidMount() {

    }
    componentWillReceiveProps(nextProps) {

        const { alertes, searchImmatriculation, searchType, searchCode } = nextProps;

        this.props.Session.set('alertes', alertes);

        const filtreMultiple = filtreAlerte(alertes ,searchType , searchCode, searchImmatriculation );
        this.props.Session.set('alertesFiltered', filtreMultiple);

    }
    componentWillUnmount() {
        Meteor.subscribe('alertes').stop()
    }
    render(){
        return (
            <div>
                <Table selectable singleLine>
                    <Table.Header>
                        <Table.Row>
                            <Table.HeaderCell/>
                            <Table.HeaderCell>Type</Table.HeaderCell>
                            <Table.HeaderCell>Code</Table.HeaderCell>
                            <Table.HeaderCell>Imm</Table.HeaderCell>
                            <Table.HeaderCell>Date_validite</Table.HeaderCell>
                            <Table.HeaderCell>Observations</Table.HeaderCell>
                        </Table.Row>
                    </Table.Header>

                    <Table.Body>
                        { this.props.alertes.length === 0 ? <EmptyTableItem text="No Items, if is an unexpected result please contact the admin"/> : undefined }
                        { this.props.loading && !!this.props.alertes.length ? <EmptyTableItem text="Loading Data , please wait ..."/>  : undefined }
                        {!!this.props.alertes.length && !this.props.loading ? ( this.props.Session.get('alertesFiltered')  ).map( (alerte) => { return <AlertesListItem key={alerte._id} alerte={alerte}/>; } ) : undefined }

                    </Table.Body>
                </Table>
            </div>
        );
    }
};

AlertesList.propTypes = {
    alertes: PropTypes.array
};

export default createContainer(() => {

    const searchType = Session.get('searchType') || undefined ;
    const searchCode = Session.get('searchCode') || undefined ;
    const searchImmatriculation = Session.get('searchImmatriculation') || undefined ;
    const alerteStartedDate = Session.get('alerteStartedDate') || new Date().setHours(0, 0, 0, 0) ;
    const alerteEndedDate = Session.get('alerteEndedDate') || new Date().setHours(23, 59, 0, 0) ;

    //const alertesHandle = Meteor.subscribe('alertes', alerteStartedDate, alerteEndedDate );
    const alertesHandle = Meteor.subscribe('alertes.autre');
    const loading = !alertesHandle.ready();

    return {
        Session,
        loading,
        searchType,
        searchCode,
        searchImmatriculation,
        alertes : Alertes.find().fetch().map((alerte)=>{
            return {
                ...alerte,
                a : moment().format(),
                b : moment(alerte.validite).format(),
                dif : moment(alerte.validite).diff( moment() , 'days') // 1
            }
        })
    };
}, AlertesList );
