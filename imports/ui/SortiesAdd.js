import React from 'react';
const R = require('ramda');
const uniqid = require('uniqid');
const ShortUniqueId = require('short-unique-id');
const uid = new ShortUniqueId();
import { sommes } from '../api/fonctions';
import { Meteor } from 'meteor/meteor';
import Flatpickr from 'react-flatpickr';
import {fr} from 'flatpickr/dist/l10n/fr.js';
import { createContainer } from 'meteor/react-meteor-data';
import { Router, Route, browserHistory } from 'react-router';
import { Button, Modal , Form, Message, Icon, Table  } from 'semantic-ui-react'

export default class SortiesAdd extends React.Component {

  constructor(props) {
    super(props);
    this.state = {
      modalOpen: false,
      code_sortie: '' ,
      date_sortie: '',
      libelle: '' ,
      demandeur: '' ,
      ordonneur:'',
      factures:[],
      designation:'',
      pu:'',
      quantite:'',
      montant : 0,
      observations: '',
      error: '',
      errorModal: '',
    };
  }
  onSubmitForm(e) {
    const {  date_sortie , libelle, demandeur , ordonneur, factures , observations } = this.state;

    e.preventDefault();

    if ( date_sortie && libelle && demandeur  && ordonneur  && factures &&   observations ) {

      console.log({date_sortie , libelle, demandeur , ordonneur, factures , observations}) ;

      Meteor.call('sorties.insert', uid.randomUUID(5) , date_sortie , libelle, demandeur , ordonneur, factures , sommes(factures) , observations.trim().toLowerCase()  , (err, res) => {
        if (!err) {
          this.setState ({
            code_sortie: '' ,
            date_sortie: '' ,
            libelle: '' ,
            demandeur: '' ,
            ordonneur:'',
            factures:[],
            observations: '',
          });
          browserHistory.replace('/sorties');
          Bert.alert( `enregistrement ${res} ajoute avec succes.`, 'danger', 'growl-top-right', 'fa-check'  )
        } else {
          this.setState({ error: err.reason });
        }
      });

    } else {
      this.setState({ error: 'Tous les champs sont requis' });
    }
  }
  onSubmitModal(e) {
    const { designation , pu , quantite , factures, montant } = this.state;

    e.preventDefault();

    if ( designation && pu  && quantite  ) {


      const facture ={id : uid.randomUUID(5) , designation, pu, quantite, total : parseInt(pu) * parseInt(quantite) } ;




      if ( Number.isInteger(facture.total) ) {

        console.log( Number.isInteger(facture.total) );

        factures.push(facture);

        this.setState( { factures , montant  });

        console.log(factures);

        console.log( this.state.factures );

        this.handleClose();

      } else {
        this.setState({ errorModal : 'prix unitaire et quantite doivent etre des nombres' });
      }

    } else {
      this.setState({ errorModal : 'All field are required' });
    }
  }
  buttonDelete(id) {

    const {  factures } = this.state;

    console.log(factures.length);
    console.log(id);
    console.log( R.findIndex(R.propEq('id', id))(factures) );
    const removeIndex = R.findIndex(R.propEq('id', id))(factures);
    factures.splice(removeIndex, 1);
    this.setState( { factures });
    console.log(this.state.factures);


  }
  handleClose() {
    this.setState({
      modalOpen: false,
      designation:'',
      pu:'',
      quantite:'',
      error:'',
      errorModal:'',
    });
  }
  handleOpen() {
    this.setState( { modalOpen: true } );
  }
  onChangeField(e, { name,value }) {
    this.setState( { [name] : value });
    console.log(`${name} -> ${value}`)
  }
  render() {

    return (
        <Form>
          {this.state.error ?
              <Message negative>
                <Message.Header>Desole , nous ne pouvons effectuer cet enregistrement</Message.Header>
                <p>{this.state.error}</p>
              </Message>
              :
              undefined}
          <Form.Group widths='equal'>
            <div className='field'>
              <label>Date sortie</label>
              <div className='ui input'>
                <Flatpickr
                    as={Form.Field}
                    data-enable-time
                    onChange={ (startDate)  => {
                      this.setState( { date_sortie : startDate[0] } ) ;
                      console.log(this.state.date_sortie) ;
                    } }
                    options={
                      {
                        altInput: true,
                        time_24hr: true,
                        locale : fr
                      }
                    }
                />
              </div>
            </div>
            <Form.Input label='Libelle'
                        name='libelle'
                        value={this.state.libelle}
                        onChange={this.onChangeField.bind(this)}/>

          </Form.Group>

          <Form.Group widths='equal'>

            <Form.Input label='Demandeur'
                        name='demandeur'
                        value={this.state.demandeur}
                        onChange={this.onChangeField.bind(this)}/>
            <Form.Input label='Ordonneur'
                        name='ordonneur'
                        value={this.state.ordonneur}
                        onChange={this.onChangeField.bind(this)}/>
          </Form.Group>

          <Form.TextArea label='Observations'
                         name='observations'
                         value={this.state.observations}
                         onChange={this.onChangeField.bind(this)}/>


          <Modal
              closeIcon
              closeOnRootNodeClick={false}
              onSubmit={this.onSubmitModal.bind(this)}
              open={this.state.modalOpen}
              onClose={this.handleClose.bind(this)}
              size='large'
              trigger={<Button onClick={this.handleOpen.bind(this)} primary >+ Ajouter 01 sortie</Button>}>
            <Modal.Header>Ajouter 01 sortie</Modal.Header>
            <Modal.Content >
              {this.state.errorModal ?
                  <Message negative>
                    <Message.Header>Desole , nous ne pouvons effectuer cet enregistrement</Message.Header>
                    <p>{this.state.errorModal}</p>
                  </Message>
                  :
                  undefined}
              <Form>

                <Form.Group widths='equal'>
                  <Form.Input label='Designation'
                              name='designation'
                              value={this.state.designation}
                              onChange={this.onChangeField.bind(this)}/>
                  <Form.Input label='P.U'
                              name='pu'
                              value={this.state.pu}
                              onChange={this.onChangeField.bind(this)}/>
                  <Form.Input label='Quantite'
                              name='quantite'
                              value={this.state.quantite}
                              onChange={this.onChangeField.bind(this)}/>
                </Form.Group>

                <Button fluid content='Ajouter 01 depense' />

              </Form>
            </Modal.Content>
          </Modal>

          <Table selectable singleLine>
            <Table.Header>
              <Table.Row>
                <Table.HeaderCell/>
                <Table.HeaderCell>Designation</Table.HeaderCell>
                <Table.HeaderCell>Prix unitaire</Table.HeaderCell>
                <Table.HeaderCell>Quantite</Table.HeaderCell>
                <Table.HeaderCell>Total</Table.HeaderCell>
              </Table.Row>
            </Table.Header>

            <Table.Body>

              {this.state.factures.map(fcture =>  <Table.Row key={fcture.id} >

                <Table.Cell>
                  <Button onClick={this.buttonDelete.bind(this,fcture.id)} color='red' size='mini' icon>
                    <Icon name='trash'/>
                  </Button>
                </Table.Cell>
                <Table.Cell> {fcture.designation} </Table.Cell>
                <Table.Cell> {fcture.pu} </Table.Cell>
                <Table.Cell> {fcture.quantite} </Table.Cell>
                <Table.Cell> {fcture.total} </Table.Cell>

              </Table.Row> )}

            </Table.Body>
          </Table>

          <h3> Total : {sommes(this.state.factures)}</h3>

          <Form.Button onClick={this.onSubmitForm.bind(this)} fluid basic color='blue'>Ajouter 01 sortie</Form.Button>

        </Form>
    );
  }
}
