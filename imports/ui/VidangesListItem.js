import React , { Component } from 'react';
import moment from 'moment';
import PropTypes from 'prop-types';
import { Session } from 'meteor/session';
import {Form, Table , Button, Icon } from 'semantic-ui-react';
import { createContainer } from 'meteor/react-meteor-data';
import {Meteor} from "meteor/meteor";

export class VidangesListItem extends Component {

    constructor (props) {
        super(props);
        this.state = {
            currentUser : Meteor.user(),
            modalOpen: false,
            error: ''
        }
    }
    componentWillReceiveProps(nextProps) {
        const { user } = nextProps;
        if (user) {
            this.setState({currentUser: user._id});
        }
    }
    deleteButton () {
        if ( Roles.userIsInRole(this.state.currentUser, 'admin' ) ) {
            return (
                <Button onClick={this.onDelete.bind(this)} color='red' size='mini' icon>
                    <Icon name='trash'/>
                </Button>
            )
        }
    }
    onDelete(e){

        e.preventDefault();
        if ( this.props.vidange._id ) {

            const suppression = confirm(`Voulez vous supprimer le paiement Mobile Money #: ${this.props.vidange.ticket} ?`);
            if (suppression) {
                Meteor.call('vidanges.delete', this.props.vidange._id , (err, res) => {
                    if (!err) {
                        Bert.alert( 'element supprime avec succes.', 'danger', 'growl-top-right', 'fa-check'  )
                    } else {
                        Bert.alert( `erreur : ${err}`, 'danger', 'growl-top-right', 'fa-close'  )
                    }
                })
            }

        } else {
            Bert.alert( 'erreur inatendue reessayez.', 'danger', 'growl-top-right', 'fa-close'  )
        }
    }
    render () {
        return (
            <Table.Row>
                <Table.Cell>{this.deleteButton()}</Table.Cell>
                <Table.Cell>{this.props.vidange.ordre}</Table.Cell>
                <Table.Cell>{this.props.vidange.immatriculation}</Table.Cell>
                <Table.Cell>{moment(this.props.vidange.dateTime).format('lll')}</Table.Cell>
                <Table.Cell>{this.props.vidange.type}</Table.Cell>
                <Table.Cell>{this.props.vidange.last}</Table.Cell>
                <Table.Cell>{this.props.vidange.nbrVoyageSimple}</Table.Cell>
                <Table.Cell>{this.props.vidange.nbrVoyageComplete}</Table.Cell>
                <Table.Cell>{this.props.vidange.observations}</Table.Cell>
            </Table.Row>
        );
    }


};

VidangesListItem.propTypes = {
    vidange: PropTypes.object.isRequired,
    Session: PropTypes.object.isRequired
};

export default createContainer(() => {

    const user = Meteor.user() || null;
    return {
        Session,
        user,
        call: Meteor.call,
    };
}, VidangesListItem );
