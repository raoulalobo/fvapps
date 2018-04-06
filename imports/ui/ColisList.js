
const R = require('ramda');

import React from 'react';
import PropTypes from 'prop-types';
import { Meteor } from 'meteor/meteor';
import { Session } from 'meteor/session';
import { createContainer } from 'meteor/react-meteor-data';
import { List } from 'semantic-ui-react'


import { Colis } from '../api/colis';
import ColisLisItem from './ColisListItem';
import ColisListEmptyItem from './ColisListEmptyItem';



export class ColisList extends React.Component{
    componentDidMount() {
        Session.set('state','A'); // Pq ne pas effectuer cette operation au niveau de ColisFilter ??
    }
    componentWillReceiveProps(nextProps) {
        const { colis, getState, getBus ,getId, getDest } = nextProps;

        //colis venus de la BDD, sa valeur ne change q si interrogation directe de la BDD
        this.props.Session.set('colis', colis);

        //Filtrer directement les colis
        let parOrdre = R.ascend(R.prop('code'));
        let byState = (coli)=> coli.state.match(  new RegExp( getState, 'i') );
        let byBus = (coli)=> coli.bus.match(  new RegExp( getBus, 'i') );
        let byCode = (coli)=> coli.code.match(  new RegExp( getId, 'i') );
        let byDest = (coli)=> coli.dest.match(  new RegExp( getDest, 'i') );
        let filtreColis = R.compose(R.filter(byDest),R.filter(byCode),R.filter(byBus),R.filter(byState))
        this.props.Session.set('colisFiltered', R.sort( parOrdre, filtreColis(colis) ));

        // Les logs
        console.log(nextProps);
        //console.log(this.props.Session.get('colis'));
    }
    componentWillUnmount() {
        Session.set('state',undefined)
    }
    render(){
        return (
            <List celled animated divided verticalAlign='middle'>
                { this.props.colis.length === 0 ? <ColisListEmptyItem text="No Items, if is an unexpected result please contact the admin"/> : undefined }
                { this.props.loading && !!this.props.colis.length ? <ColisListEmptyItem text="Loading Data , please wait ..."/>  : undefined }
                {!!this.props.colis.length && !this.props.loading ? ( this.props.Session.get('colisFiltered') ).map( (col) => { return <ColisLisItem key={col._id} col={col}/>; } ) : undefined }
            </List>
        );
    }
};

ColisList.propTypes = {
    colis: PropTypes.array.isRequired
};

export default createContainer(() => {

    const getState = Session.get('state') || undefined ;
    const getBus = Session.get('searchBus') || undefined ;
    const getId = Session.get('searchColis') || undefined ;
    const getDest = Session.get('searchVille') || undefined ;
    const StartedDate = Session.get('StartedDate') || new Date().setHours(0, 0, 0, 0) ;
    const EndedDate = Session.get('EndedDate') || new Date().setHours(23, 59, 0, 0) ;

    const colisHandle = Meteor.subscribe('colis',StartedDate,EndedDate);
    const loading = !colisHandle.ready();

    return {
        Session,
        loading,
        getState,
        getBus,
        getId,
        getDest,
        colis: Colis.find({visible: true}).fetch()
    };
}, ColisList);
