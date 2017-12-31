const _ = require('lodash');
const R = require('ramda');

import React from 'react';
import PropTypes from 'prop-types';
import { Meteor } from 'meteor/meteor';
import { Session } from 'meteor/session';
import { createContainer } from 'meteor/react-meteor-data';
import { Table } from 'semantic-ui-react';
import { nbrDeparts } from '../api/fonctions';


import { Vidanges } from '../api/vidanges';
import { Departs } from '../api/departs';

import EmptyTableItem from './EmptyTableItem';
import VidangesListItem from './VidangesListItem';


export class VidangesList extends React.Component{
    componentDidMount() {

    }
    componentWillReceiveProps(nextProps) {

        const { vidanges, departs } = nextProps;

        this.props.Session.set('vidanges', vidanges);
        console.log(nextProps);
        console.log( `Vidanges -> ${vidanges}`) ;
        console.log( `Departs -> ${departs.length}`) ;


    }
    componentWillUnmount() {
        Meteor.subscribe('vidanges').stop();
        Meteor.subscribe('departs').stop()
    }
    render(){
        return (
            <div>
                <Table selectable singleLine>
                    <Table.Header>
                        <Table.Row>
                            <Table.HeaderCell/>
                            <Table.HeaderCell>Ordre</Table.HeaderCell>
                            <Table.HeaderCell>Immatriculation</Table.HeaderCell>
                            <Table.HeaderCell>DateTime</Table.HeaderCell>
                            <Table.HeaderCell>Type</Table.HeaderCell>
                            <Table.HeaderCell>Etat</Table.HeaderCell>
                            <Table.HeaderCell>Kmtrage</Table.HeaderCell>
                            <Table.HeaderCell>Observations</Table.HeaderCell>
                        </Table.Row>
                    </Table.Header>

                    <Table.Body>
                        { this.props.vidanges.length === 0 ? <EmptyTableItem text="No Items, if is an unexpected result please contact the admin"/> : undefined }
                        { this.props.loading && !!this.props.vidanges.length ? <EmptyTableItem text="Loading Data , please wait ..."/>  : undefined }
                        {!!this.props.vidanges.length && !this.props.loading ? ( this.props.Session.get('vidanges')  ).map( (vidange) => { return <VidangesListItem key={vidange._id} vidange={vidange}/>; } ) : undefined }

                    </Table.Body>
                </Table>
            </div>
        );
    }
};

VidangesList.propTypes = {
    vidanges: PropTypes.array
};

export default createContainer(() => {

    const vidangeStartedDate = Session.get('vidangeStartedDate') || new Date().setHours(0, 0, 0, 0) ;
    const vidangeEndedDate = Session.get('vidangeEndedDate') || new Date().setHours(23, 59, 0, 0) ;

    const vidangesHandle = Meteor.subscribe('vidanges');
    const vidangesDepartsHandle = Meteor.subscribe('departsVidanges');
    const loading = !vidangesHandle.ready() && !vidangesDepartsHandle.ready();

    return {
        Session,
        loading,
        departs: Departs.find().fetch(),
        vidanges : Vidanges.find().fetch().map((vidange)=>{
            return {
                ...vidange,
                dep : Departs.find( { imm : new RegExp( vidange.immatriculation, 'i')  , dateTime: { $gte: vidange.dateTime } } ).fetch().length
            }
        })
    };
}, VidangesList );
