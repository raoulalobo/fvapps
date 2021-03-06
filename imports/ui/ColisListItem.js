import React , { Component } from 'react';
import moment from 'moment';
import PropTypes from 'prop-types';
import { Session } from 'meteor/session';
import { Grid, List , Button  , Popup , Divider } from 'semantic-ui-react';
import { createContainer } from 'meteor/react-meteor-data';

export class ColisLisItem extends Component {

  constructor (props) {
    super(props);
    this.state = {
      currentUser : Meteor.user(),
    }
  }
  componentWillReceiveProps(nextProps) {
    const { user } = nextProps;
    if (user) {
      this.setState({currentUser: user._id});
    }
  }
  adminButton () {
    // Roles.userIsInRole(this.state.currentUser, 'admin')
    if ( true ) {
      return (
          <Button
              basic
              color='red'
              icon='remove'
              size='mini'
              onClick={ () => {
                const changeState = confirm('Vous confirmez la suppression colis id '+this.props.col.code+' ? ');
                if (changeState) {
                  this.props.call('colis.deleted', this.props.col._id , (err , res)=>{
                    if (!err) {
                      Bert.alert( 'Suppression effectuee.', 'danger', 'growl-top-right', 'fa-check'  )
                    }
                  } );
                }
              } }
          />
      )
    }
  }
  smsButton () {
    if ( true ) {
      return (
          <Button
              basic
              color='blue'
              icon='mail'
              size='mini'
              onClick={ () => {
                const changeState = confirm('Vous envoyer un sms pour le colis '+this.props.col.code+' ?');
                if (changeState) {
                  this.props.call('colis.loading', this.props.col._id, this.props.col.code, this.props.col.dest, this.props.col.nameDest, this.props.col.telDest , (err , res)=>{
                    if (!err) {
                      Bert.alert( 'Mise a jour effectuee.', 'danger', 'growl-top-right', 'fa-check'  )
                    }
                  } );
                }
              } }
          />
      )
    }
  }
  render () {
    return (
        <List.Item>
          <List.Content floated='right'>
            <Grid columns='equal'>
              <Grid.Row>


                <Grid.Column only='tablet computer'>
                  <Popup
                      position='left center'
                      content={
                        <div>
                          {this.props.col.code} ({this.props.col.bus})
                          <Divider fitted />
                          {moment(this.props.col.DateTimeExp).format('LT')} ({this.props.col.dest.slice(0,3)}) {!!this.props.col.DateTimeArr ? '->'+moment(this.props.col.DateTimeArr).format('lll'):''}
                          <Divider fitted />
                          {this.props.col.nameExp}->{this.props.col.nameDest}
                          <Divider fitted />
                          {this.props.col.telExp.slice(-9)}->{this.props.col.telDest.slice(-9)}
                          <Divider fitted />
                          {!!this.props.col.expUserId ? this.props.col.expUserId.slice(0,4):''}{!!this.props.col.userIdArr ? '->'+this.props.col.userIdArr.slice(0,4):''}
                          <Divider fitted />
                          {this.props.col.desc}({this.props.col.amount})
                          <Divider fitted />
                          Recu : {!!this.props.col.agent_recu ? this.props.col.agent_recu:''}
                          <Divider fitted />
                          Saisie : {!!this.props.col.agent_saisie ? this.props.col.agent_saisie:''}
                          <Divider fitted />
                          Heure saisie : {!!this.props.col.dateTime ? moment(this.props.col.dateTime).format('LLLL'):'...'}
                        </div> }
                      trigger={<Button size='mini' icon='add' />}
                      on='click' />

                  {this.adminButton()}
                  {this.smsButton()}

                  { !this.props.col.DateTimeArr ? <Button
                      basic size='mini'
                      onClick={ () => {
                        const changeState = confirm('Vous confirmez que le colis '+this.props.col.code+' est arrive a '+this.props.col.dest+'?');
                        if (changeState) {
                          this.props.call('colis.arrived', this.props.col._id, this.props.col.code, this.props.col.dest, this.props.col.nameDest, this.props.col.telDest , (err , res)=>{
                            if (!err) {
                              Bert.alert( 'Mise a jour effectuee.', 'danger', 'growl-top-right', 'fa-check'  )
                            }
                          } );
                        }
                      } }>Arr sms.</Button> : undefined }

                  { !this.props.col.DateTimeArr ? <Button
                      basic size='mini'
                      onClick={ () => {
                        const changeState = confirm('Vous confirmez que le colis '+this.props.col.code+' est arrive a '+this.props.col.dest+' sans envoie de SMS?');
                        if (changeState) {
                          this.props.call('colis.arrived.nosms', this.props.col._id, this.props.col.code, this.props.col.dest, this.props.col.nameDest, this.props.col.telDest , (err , res)=>{
                            if (!err) {
                              Bert.alert( 'Mise a jour effectuee.', 'danger', 'growl-top-right', 'fa-check'  )
                            }
                          } );
                        }
                      } }>no sms</Button> : undefined }

                </Grid.Column>

              </Grid.Row>
            </Grid>
          </List.Content>
          {/*<Image avatar src='/assets/images/avatar/small/lena.png' />*/}
          <List.Content>
            <List.Header>{this.props.col.code}  / {this.props.col.amount}</List.Header>
            Exp. {moment(this.props.col.DateTimeExp).format('L')}
          </List.Content>
        </List.Item>
    );
  }


};

ColisLisItem.propTypes = {
  col: PropTypes.object.isRequired,
  Session: PropTypes.object.isRequired
};

export default createContainer(() => {

  const user = Meteor.user() || null;
  return {
    Session,
    user,
    call: Meteor.call,
  };
}, ColisLisItem);
