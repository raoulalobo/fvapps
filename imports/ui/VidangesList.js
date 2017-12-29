const _ = require('lodash');
const R = require('ramda');

import React from 'react';
import PropTypes from 'prop-types';
import { Meteor } from 'meteor/meteor';
import { Session } from 'meteor/session';
import { createContainer } from 'meteor/react-meteor-data';
import { Table } from 'semantic-ui-react'


import { Vidanges } from '../api/vidanges';

import EmptyTableItem from './EmptyTableItem';
import VidangesListItem from './VidangesListItem';


export class VidangesList extends React.Component{
    componentDidMount() {

    }
    componentWillReceiveProps(nextProps) {

        const { vidanges } = nextProps;

        this.props.Session.set('vidanges', vidanges);

    }
    componentWillUnmount() {
        Meteor.subscribe('vidanges').stop()
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
                            <Table.HeaderCell>Last</Table.HeaderCell>
                            <Table.HeaderCell>Class</Table.HeaderCell>
                            <Table.HeaderCell>Complete</Table.HeaderCell>
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

    const vidangesHandle = Meteor.subscribe('vidanges',vidangeStartedDate,vidangeEndedDate);
    const loading = !vidangesHandle.ready();

    return {
        Session,
        loading,
        vidanges : Vidanges.find().fetch().map((vidange)=>{
            return {
                ...vidange
            }
        })
    };
}, VidangesList );
