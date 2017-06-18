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
        if ( Roles.userIsInRole(this.state.currentUser, 'admin') ) {
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
    render () {
        return (
            <List.Item>
                <List.Content floated='right'>
                    <Grid columns='equal'>
                        <Grid.Row>
                            <Grid.Column only='mobile'>
                                <Popup
                                    position='left center'
                                    content={
                                        <div>
                                            {this.props.col.code}
                                            <Divider fitted />
                                            {moment(this.props.col.DateTimeExp).format('L')}
                                            <Divider fitted />
                                            {this.props.col.nameDest}
                                            <Divider fitted />
                                            {this.props.col.telDest}
                                        </div> }
                                    trigger={<Button size='mini' icon='add' />}
                                    on='click' />

                            </Grid.Column>

                            <Grid.Column only='tablet computer'>
                                <Popup
                                    position='left center'
                                    content={
                                        <div>
                                            {this.props.col.code}->{this.props.col.bus}
                                            <Divider fitted />
                                            {moment(this.props.col.DateTimeExp).format('LT')}->{this.props.col.dest}
                                            <Divider fitted />
                                            {this.props.col.nameDest}
                                            <Divider fitted />
                                            {this.props.col.telDest.slice(-9)}
                                        </div> }
                                    trigger={<Button size='mini' icon='add' />}
                                    on='click' />

                                {this.adminButton()}

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
                                    } }>Arr.</Button> : undefined }

                                { ( !this.props.col.DateTimeArr || this.props.col.DateTimeEnd ) ? undefined : <Button
                                    basic size='mini'
                                    onClick={ () => {
                                        const changeState = confirm('Vous confirmez que le colis '+props.col.code+' sera retire par le proprietaire du numero '+this.props.col.telDest.slice(-9)+' ?');
                                        if (changeState) {
                                            this.props.call('colis.end', this.props.col._id , (err , res )=> {
                                                if (!err) {
                                                    Bert.alert( 'Retrait effectue.', 'danger', 'growl-top-right', 'fa-check'  )
                                                }
                                            } );
                                        }
                                    } }>Ret.</Button> }

                            </Grid.Column>

                        </Grid.Row>
                    </Grid>
                </List.Content>
                {/*<Image avatar src='/assets/images/avatar/small/lena.png' />*/}
                <List.Content>
                    <List.Header>{this.props.col.code}</List.Header>
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
