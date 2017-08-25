const R = require('ramda');

import React from 'react';
import { Meteor } from 'meteor/meteor';
import PropTypes from 'prop-types';
import { Session } from 'meteor/session';
import { createContainer } from 'meteor/react-meteor-data';
import { Button } from 'semantic-ui-react'
import { filtrage, sommes } from '../api/fonctions';



export class DepartsHelpBar extends React.Component{
    constructor (props) {
        super(props);
        this.state = {
            departs : this.props.Session.get('departs') // Hum , ceci est a revoir.
        }
    }
    componentWillReceiveProps(nextProps) {
        this.setState( { departs: nextProps.getDeparts } );

        console.log(nextProps)

    }
    sendSMS(message){
        const changeState = confirm("Rapport a envoyer : \n"+ message);
        if (changeState) {
            Meteor.call('nkSMS',message,function (err) {
                if (!err) { console.log(message)} else { console.log(err)} } )
        }
    }
    render(){
        const  sms = this.state.departs ? "Ttal:"+filtrage(this.state.departs).length+" vges -> "+sommes(filtrage(this.state.departs))+"Fcfa \n"+
            "TtalVIP:"+filtrage(this.state.departs,undefined,'VIP').length+" vges -> "+sommes(filtrage(this.state.departs,undefined,'VIP'))+"Fcfa \n"+
            "TtalCla: "+filtrage(this.state.departs,undefined,'classique').length+" vges -> "+sommes(filtrage(this.state.departs,undefined,'classique'))+"Fcfa \n"+
            "Yde: "+filtrage(this.state.departs,'Douala').length+" vges -> "+sommes(filtrage(this.state.departs,'Douala'))+"Fcfa \n"+
            "YdeVIP: "+filtrage(this.state.departs,'Douala','VIP').length+" vges -> "+sommes(filtrage(this.state.departs,'Douala','VIP'))+"Fcfa \n"+
            "YdeCla: "+filtrage(this.state.departs,'Douala','classique').length+" vges -> "+sommes(filtrage(this.state.departs,'Douala','classique'))+"Fcfa \n"+
            "Dla: "+filtrage(this.state.departs,'Yaounde').length+" vges -> "+sommes(filtrage(this.state.departs,'Yaounde'))+"Fcfa \n"+
            "DlaVIP: "+filtrage(this.state.departs,'Yaounde','VIP').length+" vges -> "+sommes(filtrage(this.state.departs,'Yaounde','VIP'))+"Fcfa \n"+
            "YdeCla: "+filtrage(this.state.departs,'Yaounde','classique').length+" vges -> "+sommes(filtrage(this.state.departs,'Yaounde','classique'))+"Fcfa " : undefined
        return (
            <Button
                fluid
                animated='fade'
                color='green'
                onClick={ ()=>{sms ? this.sendSMS(sms) : console.log('Error') } }>
                <Button.Content visible>
                    {this.state.departs ? this.state.departs.length : '0'} elts ->
                    Total : {this.state.departs ? sommes(this.state.departs): '0'} Fcfa
                </Button.Content>
                <Button.Content hidden>
                    -----
                </Button.Content>
            </Button>
        );
    }
};

DepartsHelpBar.propTypes = {
    getDeparts: PropTypes.array
};

export default createContainer(() => {

    const getDeparts = Session.get('departsFiltered');

    return {
        Session,
        getDeparts,
    };
}, DepartsHelpBar);
