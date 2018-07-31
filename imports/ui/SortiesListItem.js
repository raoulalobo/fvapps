import React, { Component } from "react";
import moment from "moment";
import PropTypes from "prop-types";
import { Session } from "meteor/session";
import Flatpickr from "react-flatpickr";
import { fr } from "flatpickr/dist/l10n/fr.js";
import { Table, Button, Modal, Form, Message, Icon } from "semantic-ui-react";
import { createContainer } from "meteor/react-meteor-data";
import { Meteor } from "meteor/meteor";

export class SortiesListItem extends Component {
  constructor(props) {
    super(props);
    this.state = {
      currentUser: Meteor.user(),
      modalOpen: false
    };
  }
  componentWillReceiveProps(nextProps) {
    const { user } = nextProps;
    if (user) {
      this.setState({ currentUser: user._id });
    }
  }
  onChangeField(e, { name,value }) {
    this.setState( { [name] : value });
    console.log(`${name} -> ${value}`)
  }
  disableButton () {
    if ( Roles.userIsInRole(this.state.currentUser, 'admin' ) ) {
      return (
          <Button onClick={this.onDisable.bind(this)} size='mini' icon>
            <Icon name='checkmark'/>
          </Button>
      )
    }
  }
  onDisable(e){

    e.preventDefault();
    if ( this.props.sortie._id ) {

      const suppression = confirm(`Voulez vous desactiver cet element ? `);
      if (suppression) {
        Meteor.call('sorties.retour', this.props.sortie._id , (err, res) => {
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
  onSubmit(e) {
    e.preventDefault();
  }
  handleOpen() {
    this.setState({
      modalOpen: true,
      sortieId: this.props.sortie._id,
      code_sortie: this.props.sortie.code_sortie,
      date_sortie: this.props.sortie.date_sortie,
      ordonnateur : this.props.sortie.ordonnateur,
      demandeur : this.props.sortie.demandeur,
      libelle: this.props.sortie.libelle,
      factures: this.props.sortie.factures,
      observations: this.props.sortie.observations,
      error: ""
    });
  }
  handleClose() {
    this.setState({
      modalOpen: false,
      error: ""
    });
  }
  modifyButton() {
    if (Roles.userIsInRole(this.state.currentUser, ["admin", "caisse"])) {

      return (
          <Modal
              onSubmit={this.onSubmit.bind(this)}
              open={this.state.modalOpen}
              onClose={this.handleClose.bind(this)}
              size="small"
              trigger={
                <Button
                    onClick={this.handleOpen.bind(this)}
                    primary
                    size="mini"
                    icon
                >
                  <Icon name="eye" />
                </Button>
              }
          >
            <Modal.Header>Details</Modal.Header>
            <Modal.Content>
              {this.state.error ? (
                  <Message negative>
                    <Message.Header>
                      Desole , nous ne pouvons effectuer cet enregistrement
                    </Message.Header>
                    <p>{this.state.error}</p>
                  </Message>
              ) : (
                  undefined
              )}
              <Form>

                <Form.Group widths='equal'>

                  <Form.Input label='date_sortie'
                              name='date_sortie'
                              value={moment(this.state.date_sortie).format("lll")}
                              onChange={this.onChangeField.bind(this)} readOnly/>
                  <Form.Input label='Libelle'
                              name='libelle'
                              value={this.state.libelle}
                              onChange={this.onChangeField.bind(this)} readOnly/>

                </Form.Group>

                <Form.Group widths='equal'>

                  <Form.Input label='Demandeur'
                              name='demandeur'
                              value={this.state.demandeur}
                              onChange={this.onChangeField.bind(this)} readOnly/>
                  <Form.Input label='Ordonneur'
                              name='ordonneur'
                              value={this.state.ordonnateur}
                              onChange={this.onChangeField.bind(this)} readOnly/>
                </Form.Group>

                <Form.TextArea label='Observations'
                               name='observations'
                               value={this.state.observations}
                               onChange={this.onChangeField.bind(this)} readOnly/>

                <Table selectable singleLine>
                  <Table.Header>
                    <Table.Row>
                      <Table.HeaderCell>Designation</Table.HeaderCell>
                      <Table.HeaderCell>Prix unitaire</Table.HeaderCell>
                      <Table.HeaderCell>Quantite</Table.HeaderCell>
                      <Table.HeaderCell>Total</Table.HeaderCell>
                    </Table.Row>
                  </Table.Header>

                  <Table.Body>

                    {this.props.sortie.factures.map(fcture =>  <Table.Row key={fcture.id} >

                      <Table.Cell> {fcture.designation}</Table.Cell>
                      <Table.Cell> {fcture.pu} </Table.Cell>
                      <Table.Cell> {fcture.quantite} </Table.Cell>
                      <Table.Cell> {fcture.total} </Table.Cell>

                    </Table.Row> )}

                  </Table.Body>
                </Table>

              </Form>
            </Modal.Content>
          </Modal>
      );
    }
  }
  deleteButton () {

    if ( Roles.userIsInRole(this.state.currentUser, ['admin']) ) {
      return (
          <Button onClick={this.onDelete.bind(this)} color='red' size='mini' icon>
            <Icon name='trash'/>
          </Button>
      )
    }
  }
  onDelete(e){

    e.preventDefault();

    if ( this.props.sortie._id   ) {

      const suppression = confirm(`Voulez vous supprimer la depense code: ${this.props.sortie.code_sortie}`);
      if (suppression) {
        Meteor.call('sorties.delete', this.props.sortie._id , (err, res) => {
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
  render() {
    return (
        <Table.Row>
          <Table.Cell>
            {this.disableButton()} {this.modifyButton()} {this.deleteButton()}
          </Table.Cell>
          <Table.Cell>
            {moment(this.props.sortie.date_sortie).format("lll")}
          </Table.Cell>
          <Table.Cell>
            <Icon name={this.props.sortie.retour === 'non' ? 'close' : 'checkmark' }/>
            {this.props.sortie.code_sortie}
          </Table.Cell>
          <Table.Cell>{this.props.sortie.ordonnateur}</Table.Cell>
          <Table.Cell>{this.props.sortie.demandeur}</Table.Cell>
          <Table.Cell>{this.props.sortie.libelle}</Table.Cell>
          <Table.Cell>{this.props.sortie.montant}</Table.Cell>

        </Table.Row>
    );
  }
}

SortiesListItem.propTypes = {
  sortie: PropTypes.object.isRequired,
  Session: PropTypes.object.isRequired
};

export default createContainer(() => {
  const user = Meteor.user() || null;
  return {
    Session,
    user,
    call: Meteor.call
  };
}, SortiesListItem);
