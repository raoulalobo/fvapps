import React from 'react';
import { Meteor } from 'meteor/meteor';
import Flatpickr from 'react-flatpickr';
import {fr} from 'flatpickr/dist/l10n/fr.js';
import { createContainer } from 'meteor/react-meteor-data';
import { Button, Modal , Form, Message } from 'semantic-ui-react'

export default class SortiesAddDepenses extends React.Component {

  constructor(props) {
    super(props);
    this.state = {
      modalOpen: false,
      code_sortie: '' ,
      date_sortie: '' ,
      designation: '' ,
      demandeur: '' ,
      ordonnateur:'',
      factures:'',
      observations: '',
      error: ''
    };
  }
  onSubmit(e) {
    const { code_sortie , date_sortie, designation , demandeur , ordonnateur, factures , observations } = this.state;

    e.preventDefault();

    if ( code_sortie && date_sortie && designation && demandeur  && ordonnateur  && factures &&   observations ) {

      Meteor.call('sorties.insert', code_sortie , date_sortie, designation , demandeur , ordonnateur, factures , observations.trim().toLowerCase()  , (err, res) => {
        if (!err) {
          this.handleClose();
          Bert.alert( `enregistrement ${res} ajoute avec succes.`, 'danger', 'growl-top-right', 'fa-check'  )
        } else {
          this.setState({ error: err.reason });
        }
      });

    } else {
      this.setState({ error: 'All field are required' });
    }
  }
  handleClose() {
    this.setState({
      modalOpen: false,
      code_sortie: '' ,
      date_sortie: '' ,
      designation: '' ,
      demandeur: '' ,
      ordonnateur:'',
      factures:'',
      observations: '',
      error: ''
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
    const options = [
      { key: 's', text: 'Simple', value: 'simple' },
      { key: 'c', text: 'Complete', value: 'complete' },
    ]
    return (

        <Modal
            closeIcon
            closeOnRootNodeClick={false}
            onSubmit={this.onSubmit.bind(this)}
            open={this.state.modalOpen}
            onClose={this.handleClose.bind(this)}
            size='small'
            trigger={<Button onClick={this.handleOpen.bind(this)} primary size='mini'>+ Ajouter 01 sortie</Button>}>
          <Modal.Header>Ajouter 01 sortie</Modal.Header>
          <Modal.Content >
            {this.state.error ?
                <Message negative>
                  <Message.Header>Desole , nous ne pouvons effectuer cet enregistrement</Message.Header>
                  <p>{this.state.error}</p>
                </Message>
                :
                undefined}

            <Form>

              <Form.Group widths='equal'>

                <div className='field'>
                  <label>Date sortie</label>
                  <div className='ui input'>
                    <Flatpickr
                        as={Form.Field}
                        data-enable-time
                        onChange={ (startDate)  => {
                          this.setState( { dateTime : startDate[0] } ) ;
                          console.log(this.state.dateTime) ;
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

                <Form.Input label='Ordre'
                            name='ordre'
                            value={this.state.ordre}
                            onChange={this.onChangeField.bind(this)}/>

              </Form.Group>

              <Form.Group widths='equal'>

                <Form.Input label='Immatriculation'
                            name='immatriculation'
                            value={this.state.immatriculation}
                            onChange={this.onChangeField.bind(this)}/>

                <Form.Dropdown
                    label='Type de sortie'
                    minCharacters={0}
                    name='type'
                    placeholder='Selectionnez 01 type de sortie'
                    search
                    selection
                    options={options}
                    onChange={this.onChangeField.bind(this)}/>

              </Form.Group>


              <Form.Group widths='equal'>

                <Form.Input label='Nbr voyages simples'
                            name='nbrVoyageSimple'
                            value={this.state.nbrVoyageSimple}
                            onChange={this.onChangeField.bind(this)}/>

                <Form.Input label='Kilometrage'
                            name='kilometrage'
                            value={this.state.kilometrage}
                            onChange={this.onChangeField.bind(this)}/>


              </Form.Group>

              <Form.TextArea label='Historique ( # , Date heure, Type , Ordre , Kmtrage, Observations )'
                             name='observations'
                             value={this.state.observations}
                             onChange={this.onChangeField.bind(this)}/>
              <Form.Button fluid basic color='blue'>Ajouter 01 sortie</Form.Button>

            </Form>

          </Modal.Content>
        </Modal>
    );
  }
}
