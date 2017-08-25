
const _ = require('lodash');
const R = require('ramda');

import React from 'react';
import PropTypes from 'prop-types';
import { Meteor } from 'meteor/meteor';
import { Session } from 'meteor/session';
import { createContainer } from 'meteor/react-meteor-data';
import { Table } from 'semantic-ui-react'

import { filtreDepenses } from '../api/fonctions';
import { Depenses } from '../api/depenses';

import DepartsEmptyListItem from './DepartsEmptyListItem';
import DepensesListItem from './DepensesListItem';


export class DepensesList extends React.Component{
    componentDidMount() {

    }
    componentWillReceiveProps(nextProps) {

        const { depenses, searchDesi, searchCode, searchGenre } = nextProps;

        this.props.Session.set('depenses', depenses);

        let byGenre = (depense)=> depense.genre.match(  new RegExp( searchGenre, 'i') );
        let byDesi = (depense)=> depense.desi.match(  new RegExp( searchDesi, 'i') );
        let byCode = (depense)=> depense.code.match(  new RegExp( searchCode, 'i') );
        const filtreMultiple = R.compose(R.filter(byGenre),R.filter(byCode),R.filter(byDesi)) ;
        this.props.Session.set('depensesFiltered', filtreMultiple(depenses));

        // Rapports

        console.log(nextProps);
        //console.log(this.props.Session.get('colis'));
    }
    componentWillUnmount() {
        Session.set('state',undefined)
    }
    render(){
        return (
            <div>
                <Table selectable singleLine>
                    <Table.Header>
                        <Table.Row>
                            <Table.HeaderCell/>
                            <Table.HeaderCell>Date_Heure</Table.HeaderCell>
                            <Table.HeaderCell>Type</Table.HeaderCell>
                            <Table.HeaderCell>Code / Imm</Table.HeaderCell>
                            <Table.HeaderCell>Designation</Table.HeaderCell>
                            <Table.HeaderCell>Prix unit.</Table.HeaderCell>
                            <Table.HeaderCell>Quantite</Table.HeaderCell>
                            <Table.HeaderCell>Total</Table.HeaderCell>
                            <Table.HeaderCell>Notes</Table.HeaderCell>
                        </Table.Row>
                    </Table.Header>

                    <Table.Body>
                        { this.props.depenses.length === 0 ? <DepartsEmptyListItem text="No Items, if is an unexpected result please contact the admin"/> : undefined }
                        { this.props.loading && !!this.props.depenses.length ? <DepartsEmptyListItem text="Loading Data , please wait ..."/>  : undefined }
                        {!!this.props.depenses.length && !this.props.loading ? ( this.props.Session.get('depensesFiltered')).map( (depense) => { return <DepensesListItem key={depense._id} depense={depense}/>; } ) : undefined }

                    </Table.Body>
                </Table>
            </div>
        );
    }
};

DepensesList.propTypes = {
    ventes: PropTypes.array
};

export default createContainer(() => {
    
    const searchGenre = Session.get('searchGenre') || undefined ;
    const searchCode = Session.get('searchCode') || undefined ;
    const searchDesi = Session.get('searchDesi') || undefined ;
    const depenseStartedDate = Session.get('depenseStartedDate') || new Date().setHours(0, 0, 0, 0) ;
    const depenseEndedDate = Session.get('depenseEndedDate') || new Date().setHours(23, 59, 0, 0) ;

    const depensesHandle = Meteor.subscribe('depenses',depenseStartedDate,depenseEndedDate);
    const loading = !depensesHandle.ready();

    return {
        Session,
        loading,
        searchGenre,
        searchCode,
        searchDesi,
        depenses : Depenses.find({visible: true}).fetch().map((depense)=>{
            return {
                ...depense,
                total :  depense.pu  * depense.qtte
            }
        })
    };
}, DepensesList);
