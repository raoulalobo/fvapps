const _ = require('lodash');
const R = require('ramda');

import React from 'react';
import PropTypes from 'prop-types';
import { Meteor } from 'meteor/meteor';
import { Session } from 'meteor/session';
import { createContainer } from 'meteor/react-meteor-data';
import { Table } from 'semantic-ui-react'


import { Mmoneys } from '../api/mmoneys';

import EmptyTableItem from './EmptyTableItem';
import MmoneysListItem from './MmoneysListItem';


export class MmoneysList extends React.Component{
    componentDidMount() {

    }
    componentWillReceiveProps(nextProps) {

        const { mmoneys, searchTicket, searchNom } = nextProps;

        this.props.Session.set('mmoneys', mmoneys);

        let byNom = (mmoney)=> mmoney.nom.match(  new RegExp( searchNom, 'i') );
        let byDate = R.ascend(R.prop('dateTimeV'));
        //console.log( searchNom );
        let byTicket = (mmoney)=> mmoney.ticket.match(  new RegExp( searchTicket, 'i') );
        const filtreMultiple = R.compose(R.filter(byNom),R.filter(byTicket)) ;
        //return R.sort( byDate, filtreMultiple(tableauElements) );
        this.props.Session.set('mmoneysFiltered', R.sort( byDate, filtreMultiple(tableauElements) ) );

/*        const { mmoneys } = nextProps;
        console.log(this.props);
        console.log(nextProps);
        this.props.Session.set('mmoneys', mmoneys);*/

    }
    componentWillUnmount() {
        Meteor.subscribe('mmoneys').stop()
    }
    render(){
        return (
            <div>
                <Table selectable singleLine>
                    <Table.Header>
                        <Table.Row>
                            <Table.HeaderCell/>
                            <Table.HeaderCell>#Ticket</Table.HeaderCell>
                            <Table.HeaderCell>Date_paiement</Table.HeaderCell>
                            <Table.HeaderCell>Date_voyage</Table.HeaderCell>
                            <Table.HeaderCell>Noms</Table.HeaderCell>
                            <Table.HeaderCell>Destination</Table.HeaderCell>
                            <Table.HeaderCell>Telephone</Table.HeaderCell>
                            <Table.HeaderCell>Observations</Table.HeaderCell>
                        </Table.Row>
                    </Table.Header>

                    <Table.Body>
                        { this.props.mmoneys.length === 0 ? <EmptyTableItem text="No Items, if is an unexpected result please contact the admin"/> : undefined }
                        { this.props.loading && !!this.props.mmoneys.length ? <EmptyTableItem text="Loading Data , please wait ..."/>  : undefined }
                        {!!this.props.mmoneys.length && !this.props.loading ? ( this.props.Session.get('mmoneysFiltered')  ).map( (mmoney) => { return <MmoneysListItem key={mmoney._id} mmoney={mmoney}/>; } ) : undefined }

                    </Table.Body>
                </Table>
            </div>
        );
    }
};

MmoneysList.propTypes = {
    mmoneys: PropTypes.array
};

export default createContainer(() => {

    const searchNom = Session.get('searchNom') || undefined ;
    const searchTicket = Session.get('searchTicket') || undefined ;
    const mmoneyStartedDate = Session.get('mmoneyStartedDate') || new Date().setHours(0, 0, 0, 0) ;
    const mmoneyEndedDate = Session.get('mmoneyEndedDate') || new Date().setHours(23, 59, 0, 0) ;

    const mmoneysHandle = Meteor.subscribe('mmoneys',mmoneyStartedDate,mmoneyEndedDate);
    const loading = !mmoneysHandle.ready();

    return {
        Session,
        loading,
        searchNom,
        searchTicket,
        mmoneys : Mmoneys.find().fetch().map((mmoney)=>{
            return {
                ...mmoney
            }
        })
    };
}, MmoneysList );
