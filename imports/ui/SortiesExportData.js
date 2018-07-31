import React from 'react';
import { Meteor } from 'meteor/meteor';
import PropTypes from 'prop-types';
import { Session } from 'meteor/session';
import { createContainer } from 'meteor/react-meteor-data';
import { Button } from 'semantic-ui-react'
import { sommeSorties } from '../api/fonctions';



export class SortiesExportData extends React.Component{
  constructor (props) {
    super(props);
    this.state = {
      sorties: this.props.Session.get("sorties") ,// Hum , ceci est a revoir.
      recu: this.props.Session.get("recu")
    }
  }
  componentWillReceiveProps(nextProps) {

    this.setState( { recus: nextProps.recu } );
    this.setState( { sorties: nextProps.sorties } );

    console.log( sommeSorties(this.state.sorties) );
    console.log( sommeSorties(this.state.recu) );

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
    const  sms = this.state.sorties ? `Etats des sorties
     Rolande : ${sommeSorties(this.state.sorties)}
     Recus: ${sommeSorties(this.state.recu)}
     Difference : ${ sommeSorties(this.state.sorties) - sommeSorties(this.state.recu) }
     ` : `Erreur, conactez le service IT`
    return (
        <Button
            size="mini"
            animated='fade'
            color='green'
            onClick={ ()=> this.sendSMS(sms) }>
          <Button.Content visible>
            rapport
          </Button.Content>
          <Button.Content hidden>
            -----
          </Button.Content>
        </Button>
    );
  }
};

SortiesExportData.propTypes = {
  getSorties: PropTypes.array
};

export default createContainer(() => {

  const sorties = Session.get('sorties');
  const recu = Session.get('recu');

  return {
    Session,
    sorties,
    recu
  };
}, SortiesExportData);
