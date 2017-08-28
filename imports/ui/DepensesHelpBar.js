const R = require('ramda');

import React from 'react';
import PropTypes from 'prop-types';
import { Session } from 'meteor/session';
import { createContainer } from 'meteor/react-meteor-data';
import { Button, Icon } from 'semantic-ui-react';
import { filtreDepenses, sommes, sommesLitre } from '../api/fonctions';


export class DepensesHelpBar extends React.Component{
    constructor (props) {
        super(props);
        this.state = {
            depenses : this.props.Session.get('depenses') // Hum , ceci est a revoir.
        }
    }
    componentWillReceiveProps(nextProps) {
        this.setState( { depenses: nextProps.getDepenses } );
        console.log(nextProps)
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
        const  sms = this.state.depenses ? `Ttal:${filtreDepenses(this.state.depenses,'DC').length}cons(${sommesLitre(filtreDepenses(this.state.depenses,'DC'))}L),${sommes(filtreDepenses(this.state.depenses,'DC'))}Fcfa 
Bus: ${filtreDepenses(this.state.depenses,'DCB').length}cons(${sommesLitre(filtreDepenses(this.state.depenses,'DCB'))}L),${sommes(filtreDepenses(this.state.depenses,'DCB'))}Fcfa
Nav:${filtreDepenses(this.state.depenses,'DCN').length}cons(${sommesLitre(filtreDepenses(this.state.depenses,'DCN'))}L),${sommes(filtreDepenses(this.state.depenses,'DCN'))}Fcfa
Grp:${filtreDepenses(this.state.depenses,'DCG').length}cons(${sommesLitre(filtreDepenses(this.state.depenses,'DCG'))}L),${sommes(filtreDepenses(this.state.depenses,'DCG'))}Fcfa` : `Erreur, conactez le service IT`
        return (
            <Button
                fluid
                animated
                color='green'
                onClick={ ()=> this.sendSMS(sms) }>
                <Button.Content visible>
                    {this.state.depenses ? this.state.depenses.length : '0'} elts ->
                    Total : {sommes(this.state.depenses)} Fcfa
                </Button.Content>
                <Button.Content hidden>
                    <Icon name='file excel outline' />
                </Button.Content>
            </Button>
        );
    }
};

DepensesHelpBar.propTypes = {
    getDepenses: PropTypes.array
};

export default createContainer(() => {

    const getDepenses = Session.get('depensesFiltered');

    return {
        Session,
        getDepenses,
    };
}, DepensesHelpBar);
