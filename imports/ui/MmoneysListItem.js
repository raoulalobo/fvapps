import React , { Component } from 'react';
import moment from 'moment';
import PropTypes from 'prop-types';
import { Session } from 'meteor/session';
import {Form, Table , Button, Icon } from 'semantic-ui-react';
import { createContainer } from 'meteor/react-meteor-data';
import {Meteor} from "meteor/meteor";

export class MmoneysListItem extends Component {

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
        if ( this.props.mmoney._id ) {

            const suppression = confirm(`Voulez vous supprimer le paiement Mobile Money #: ${this.props.mmoney.ticket} ?`);
            if (suppression) {
                Meteor.call('mmoneys.delete', this.props.mmoney._id , (err, res) => {
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
                <Table.Cell>{this.props.mmoney._id} - {this.props.mmoney.prest}</Table.Cell>
                <Table.Cell>{moment(this.props.mmoney.dateTime).format('lll')}</Table.Cell>
                <Table.Cell>{moment(this.props.mmoney.dateTimeV).format('lll')}</Table.Cell>
                <Table.Cell>{this.props.mmoney.nom}</Table.Cell>
                <Table.Cell>{this.props.mmoney.cni}</Table.Cell>
                <Table.Cell>{this.props.mmoney.phone}</Table.Cell>
                <Table.Cell>{this.props.mmoney.observations}</Table.Cell>
            </Table.Row>
        );
    }


};

MmoneysListItem.propTypes = {
    mmoney: PropTypes.object.isRequired,
    Session: PropTypes.object.isRequired
};

export default createContainer(() => {

    const user = Meteor.user() || null;
    return {
        Session,
        user,
        call: Meteor.call,
    };
}, MmoneysListItem );
