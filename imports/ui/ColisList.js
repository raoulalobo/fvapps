
const _ = require('lodash');

import React from 'react';
import PropTypes from 'prop-types';
import { Meteor } from 'meteor/meteor';
import { Session } from 'meteor/session';
import { createContainer } from 'meteor/react-meteor-data';
import { Grid , List , Image , Button } from 'semantic-ui-react'


import { Colis } from '../api/colis';
import ColisLisItem from './ColisListItem';
import ColisListEmptyItem from './ColisListEmptyItem';



export class ColisList extends React.Component{
    componentDidMount() {
        Session.set('state','A');
    }
    componentWillReceiveProps(nextProps) {
        const { colis } = nextProps;
        this.props.Session.set('colis', colis);
        //console.log(nextProps);
        //console.log(this.props.Session.get('colis'));
    }
    componentWillUnmount() {
        Session.set('state',undefined)
    }
    render(){
        const getState = this.props.getState ;
        const getId = this.props.getId ;
        const getDest = this.props.getDest ;
        const StartedDate = this.props.StartedDate ;
        const EndedDate = this.props.EndedDate ;
        return (
            <List celled animated divided verticalAlign='middle'>
                { this.props.colis.length === 0 ? <ColisListEmptyItem text="No Items, if is an unexpected result please contact the admin"/> : undefined }
                { this.props.loading && !!this.props.colis.length ? <ColisListEmptyItem text="Loading Data , please wait ..."/>  : undefined }
                {!!this.props.colis.length && !this.props.loading ? (_.chain(this.props.colis)
                    .filter(function(coli) { return coli.state.match(  new RegExp( getState, 'i') ); })
                    .filter(function(coli) { return coli.code.match(  new RegExp( getId, 'i') ); })
                    .filter(function(coli) { return coli.dest.match(  new RegExp( getDest, 'i') ); })
                    .filter(function(coli) { return coli.DateTimeExp >= StartedDate.getTime(); })
                    .filter(function(coli) { return coli.DateTimeExp <= EndedDate.getTime(); })
                    .value() )
                    .map( (col) => { return <ColisLisItem key={col._id} col={col}/>; } ) : undefined }
            </List>
        );
    }
};

ColisList.propTypes = {
    colis: PropTypes.array.isRequired
};

export default createContainer(() => {

    const colisHandle = Meteor.subscribe('colis');
    const loading = !colisHandle.ready();

    let search = {} ;
    const getState = Session.get('state') || undefined ;
    const getId = Session.get('searchColis') || undefined ;
    const getDest = Session.get('searchVille') || undefined ;
    const StartedDate = Session.get('StartedDate') || new Date('1970-01-01') ;
    const EndedDate = Session.get('EndedDate') || new Date();
    if ( !!getState ) search.state = {$regex: new RegExp( getState  ), $options: "i"};

    return {
        Session,
        loading,
        getState,
        getId,
        getDest,
        StartedDate,
        EndedDate,
        colis: Colis.find({visible: true}).fetch()
    };
}, ColisList);
