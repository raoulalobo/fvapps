const _ = require('lodash');
const R = require('ramda');

import React from 'react';
import PropTypes from 'prop-types';
import { Meteor } from 'meteor/meteor';
import { Session } from 'meteor/session';
import { createContainer } from 'meteor/react-meteor-data';
import { Table } from 'semantic-ui-react';
import {filtreVidange } from '../api/fonctions';


import { Vidanges } from '../api/vidanges';
import { Departs } from '../api/departs';

import EmptyTableItem from './EmptyTableItem';
import VidangesListItem from './VidangesListItem';


export class VidangesList extends React.Component{
    componentDidMount() {

    }
    componentWillReceiveProps(nextProps) {

        const { vidanges, departs, vidangeImmatriculation , vidangeOrdre } = nextProps;

        this.props.Session.set('vidanges', vidanges);
        //console.log(nextProps);
        //console.log( `Vidanges -> ${vidanges}`) ;
        //console.log( `Departs -> ${departs.length}`) ;

        // Filtre
        const filtreMultipleVidanges = filtreVidange( vidanges , vidangeImmatriculation, vidangeOrdre);
        this.props.Session.set('vidangesFiltered', filtreMultipleVidanges);


    }
    componentWillUnmount() {
        Meteor.subscribe('vidanges').stop();
        Meteor.subscribe('departsVidanges').stop();
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
                        { this.props.departs.length === 0 ? <EmptyTableItem text="No Items, if is an unexpected result please contact the admin"/> : undefined }
                        { this.props.loading && !!this.props.departs.length ? <EmptyTableItem text="Loading Data , please wait ..."/>  : undefined }
                        {!!this.props.departs.length && !this.props.loading ? ( this.props.Session.get('vidangesFiltered')  ).map( (vidange) => { return <VidangesListItem key={vidange._id} vidange={vidange}/>; } ) : undefined }

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

    const vidangeImmatriculation = Session.get('searchImmatriculation') ;
    const vidangeOrdre = Session.get('searchOdre') ;

    const vidangesHandle = Meteor.subscribe('vidanges');
    const vidangesDepartsHandle = Meteor.subscribe('departsVidanges');
    const loading = !vidangesDepartsHandle.ready();

    return {
        Session,
        vidangeImmatriculation,
        vidangeOrdre,
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
