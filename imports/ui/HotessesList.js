import React from 'react';
import PropTypes from 'prop-types';
import { Meteor } from 'meteor/meteor';
import { Session } from 'meteor/session';
import { createContainer } from 'meteor/react-meteor-data';
import { Table } from 'semantic-ui-react'


import { Hotesses } from '../api/hotesses';

import EmptyTableItem from './EmptyTableItem';
import HotessesListItem from './HotessesListItem';


export class HotessesList extends React.Component{
    componentDidMount() {

    }
    componentWillReceiveProps(nextProps) {

        const { hotesses } = nextProps;
        console.log(this.props)
        console.log(nextProps)
        this.props.Session.set('hotesses', hotesses);

    }
    componentWillUnmount() {
        Meteor.subscribe('hotesses').stop()
    }
    render(){
        return (
            <div>
                <Table selectable singleLine>
                    <Table.Header>
                        <Table.Row>
                            <Table.HeaderCell>Age</Table.HeaderCell>
                            <Table.HeaderCell>Noms</Table.HeaderCell>
                            <Table.HeaderCell>CNI</Table.HeaderCell>
                            <Table.HeaderCell>Telephone #1</Table.HeaderCell>
                            <Table.HeaderCell>Telephone #2</Table.HeaderCell>
                            <Table.HeaderCell>Observations</Table.HeaderCell>
                        </Table.Row>
                    </Table.Header>

                    <Table.Body>
                        { this.props.hotesses.length === 0 ? <EmptyTableItem text="No Items, if is an unexpected result please contact the admin"/> : undefined }
                        { this.props.loading && !!this.props.hotesses.length ? <EmptyTableItem text="Loading Data , please wait ..."/>  : undefined }
                        {!!this.props.hotesses.length && !this.props.loading ? ( this.props.Session.get('hotesses')  ).map( (hotesse) => { return <HotessesListItem key={hotesse._id} hotesse={hotesse}/>; } ) : undefined }

                    </Table.Body>
                </Table>
            </div>
        );
    }
};

HotessesList.propTypes = {
    hotesses: PropTypes.array
};

export default createContainer(() => {


    const hotessesHandle = Meteor.subscribe('hotesses');
    const loading = !hotessesHandle.ready();

    return {
        Session,
        loading,
        hotesses : Hotesses.find().fetch().map((hotesse)=>{
            return {
                ...hotesse
            }
        })
    };
}, HotessesList );
