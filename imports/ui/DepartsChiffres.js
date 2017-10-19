const _ = require('lodash');
const jsonexport = require('jsonexport');
const fileDownload = require('react-file-download');

import React from 'react';
import PropTypes from 'prop-types';
import { Session } from 'meteor/session';
import { createContainer } from 'meteor/react-meteor-data';
import { Button, Icon } from 'semantic-ui-react'




export class DepartsChiffres extends React.Component{
    constructor (props) {
        super(props);
        this.state = {
            currentUser : Meteor.user(),
            getDeparts : this.props.getDeparts // Utile finalement
        }
    }
    componentWillReceiveProps(nextProps) {
        const { user, getDeparts } = nextProps;
        if (user) {
            this.setState({currentUser: user._id});
        }
        this.setState( { getDeparts } );
        console.log(getDeparts);
    }
    render(){
        //const userid = this.state.currentUser
        //const nomBG = this.props.nomBG ;
        //const PDV = this.props.PDV ;
        //const StartedDate = this.props.StartedDate ;
        //const EndedDate = this.props.EndedDate ;
        return (
            <Button
                animated
                size='mini'
                color='blue'
                onClick={ ()=>{
                    tbl = []
                    gprby = _.chain(this.state.getDeparts)
                        .groupBy(function(departs) { return departs.dest ; })
                        .value()
                    for(let prop in gprby) {
                        if(!gprby.hasOwnProperty(prop)) continue;

                        smmVIP = _.chain(this.state.getDeparts)
                            .filter(function(depart) { return depart.dest.match(  new RegExp( prop, 'i') ); })
                            .filter(function(depart) { return depart.classe.match(  new RegExp( 'VIP', 'i') ); })
                            .reduce(function(sum, n) {return sum + n.total;}, 0)
                            .value() ;

                        smmCl = _.chain(this.state.getDeparts)
                            .filter(function(depart) { return depart.dest.match(  new RegExp( prop, 'i') ); })
                            .filter(function(depart) { return depart.classe.match(  new RegExp( 'Classique', 'i') ); })
                            .reduce(function(sum, n) {return sum + n.total;}, 0)
                            .value() ;
                        
                        smm = smmVIP + smmCl ;

                        tbl.push({prop, smmVIP, smmCl, smm });
                    }
                    console.log( tbl )
                }} >
                <Button.Content visible>
                    Stats
                </Button.Content>
                <Button.Content hidden>
                    <Icon name='pie chart' />
                </Button.Content>
            </Button>
        );
    }
};

DepartsChiffres.propTypes = {
    getDeparts: PropTypes.array
};

export default createContainer(() => {


    //const nomBG = Session.get('nomBG') || undefined ;
    //const PDV = Session.get('PDV') || undefined ;
    //const StartedDate = Session.get('StartedDate') || new Date().setHours(0, 0, 0, 0) ;
    //const EndedDate = Session.get('EndedDate') || new Date().setHours(23, 59, 0, 0) ;

    const getDeparts = Session.get('departs');
    const user = Meteor.user() || null;

    return {
        Session,
        getDeparts,
        user
    };
}, DepartsChiffres );
