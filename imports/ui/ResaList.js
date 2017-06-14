
const _ = require('lodash');

import React from 'react';
import PropTypes from 'prop-types';
import { Meteor } from 'meteor/meteor';
import { List } from 'semantic-ui-react';
import { Session } from 'meteor/session' ;
import { createContainer } from 'meteor/react-meteor-data';


import { Resas } from '../api/resas';
import ResaListItem from './ResaListItem';
import ColisListEmptyItem from './ColisListEmptyItem';



export class ColisList extends React.Component{
    componentDidMount() {
        
    }
    componentWillReceiveProps(nextProps) {
        const { resas } = nextProps;
        this.props.Session.set('resas', resas);
        console.log(nextProps);
        console.log(this.props.Session.get('resas'));
    }
    componentWillUnmount() {
    }
    render(){
        const getPhone = this.props.getPhone ;
        return (
            <List celled animated divided verticalAlign='middle'>
                { this.props.resas.length === 0 ? <ColisListEmptyItem text="No Items, if is an unexpected result please contact the admin"/> : undefined }
                { this.props.loading && !!this.props.resas.length ? <ColisListEmptyItem text="Loading Data , please wait ..."/>  : undefined }
                {!!this.props.resas.length && !this.props.loading ? (_.chain(this.props.resas)
                    .filter(function(resa) { return resa.phone.match(  new RegExp( getPhone, 'i') ); })
                    .value() )
                    .map( (res) => { return <ResaListItem key={res._id} res={res}/>; } ) : undefined }
            </List>
        );
    }
};

ColisList.propTypes = {
    resas: PropTypes.array.isRequired
};

export default createContainer(() => {

    const resasHandle = Meteor.subscribe('resas');
    const loading = !resasHandle.ready();

    const getPhone = Session.get('phone') || undefined ;

    return {
        Session,
        loading,
        getPhone,
        resas : Resas.find({}).fetch()
    };
}, ColisList);
