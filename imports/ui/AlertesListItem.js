import React , { Component } from 'react';
import moment from 'moment';
import PropTypes from 'prop-types';
import { Session } from 'meteor/session';
import {Form, Table , Button, Icon } from 'semantic-ui-react';
import { createContainer } from 'meteor/react-meteor-data';
import {Meteor} from "meteor/meteor";

export class AlertesListItem extends Component {

    constructor (props) {
        super(props);
        this.state = {
            currentUser : Meteor.user()
        }
    }
    componentWillReceiveProps(nextProps) {
        const { user } = nextProps;
        if (user) {
            this.setState({currentUser: user._id});
        }
    }
    deleteButton () {
        if ( Roles.userIsInRole(this.state.currentUser, 'admin'  ) && parseInt(this.props.alerte.dif) < parseInt(30) ) {
            return (
                <Button onClick={this.onDelete.bind(this)} color='blue' size='mini' icon>
                    <Icon name={ parseInt(this.props.alerte.dif) < parseInt(30) &&  this.props.alerte.visible === true ? 'unlock' : 'lock' }/>
                </Button>
            )
        }
    }
    onDelete(e){

        e.preventDefault();
        if ( this.props.alerte._id ) {

            const suppression = confirm(`Voulez vous supprimer l'alerte  ${this.props.alerte.type} ${this.props.alerte.code} ?`);
            if (suppression) {
                Meteor.call('alertes.false', this.props.alerte._id , (err, res) => {
                    if (!err) {
                        Bert.alert( 'element passe en mode regle.', 'danger', 'growl-top-right', 'fa-check'  )
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
            <Table.Row error={ parseInt(this.props.alerte.dif) < parseInt(30) &&  this.props.alerte.visible === true ? true : false }>
                <Table.Cell>{this.deleteButton()}</Table.Cell>
                <Table.Cell>{this.props.alerte.type}</Table.Cell>
                <Table.Cell>{this.props.alerte.code}</Table.Cell>
                <Table.Cell>{this.props.alerte.immatriculation}</Table.Cell>
                <Table.Cell>{moment(this.props.alerte.validite).format('lll')} { this.props.alerte.visible === false ? '' : ` / ${this.props.alerte.dif}`}</Table.Cell>
                <Table.Cell>{this.props.alerte.observations}</Table.Cell>
            </Table.Row>
        );
    }


};

AlertesListItem.propTypes = {
    alerte: PropTypes.object.isRequired,
    Session: PropTypes.object.isRequired
};

export default createContainer(() => {

    const user = Meteor.user() || null;
    return {
        Session,
        user,
        call: Meteor.call,
    };
}, AlertesListItem );
