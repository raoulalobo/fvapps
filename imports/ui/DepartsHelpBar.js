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
        //console.log(nextProps)

    }
    sendSMS(message){
        const changeState = confirm("Rapport a envoyer : \n"+ message);
        if (changeState) {
            Meteor.call('nkSMS',message,function (err) {
                if (!err) {
                    //console.log(message) ;
                    Bert.alert( 'Message envoye avec succes.', 'danger', 'growl-top-right', 'fa-check'  ) }
                    else
                        {
                            console.log(err);
                            Bert.alert( 'erreur inatendue reessayez.', 'danger', 'growl-top-right', 'fa-close'  )
                        }
            } )
        }
    }
    render(){
        const  sms = this.state.departs ? `Ttal:${filtrage(this.state.departs).length}vges,${sommes(filtrage(this.state.departs))}Fcfa 
TtalVIP: ${filtrage(this.state.departs,undefined,'VIP').length}vges,${sommes(filtrage(this.state.departs,undefined,'VIP'))}Fcfa
TtalCla:${filtrage(this.state.departs,undefined,'classique').length}vges,${sommes(filtrage(this.state.departs,undefined,'classique'))}Fcfa
Yde:${filtrage(this.state.departs,'Douala').length} vges,${sommes(filtrage(this.state.departs,'Douala'))}Fcfa
YdeVIP:${filtrage(this.state.departs,'Douala','VIP').length}vges,${sommes(filtrage(this.state.departs,'Douala','VIP'))}Fcfa
YdeCla:${filtrage(this.state.departs,'Douala','classique').length}vges,${sommes(filtrage(this.state.departs,'Douala','classique'))}Fcfa
Dla:${filtrage(this.state.departs,'Yaounde').length}vges,${sommes(filtrage(this.state.departs,'Yaounde'))}Fcfa
DlaVIP:${filtrage(this.state.departs,'Yaounde','VIP').length}vges,${sommes(filtrage(this.state.departs,'Yaounde','VIP'))}Fcfa
DlaCla:${filtrage(this.state.departs,'Yaounde','classique').length}vges,${sommes(filtrage(this.state.departs,'Yaounde','classique'))}Fcfa` : `Erreur, conactez le service IT`
        return (
            <Button
                fluid
                animated='fade'
                color='green'
                onClick={ ()=> this.sendSMS(sms) }>
                <Button.Content visible>
                    {this.state.departs ? this.state.departs.length : '0'} elts ,
                    Total : {sommes(this.state.departs)} Fcfa
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
