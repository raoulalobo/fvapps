import React from 'react';
import { Meteor } from 'meteor/meteor';
import Flatpickr from 'react-flatpickr';
import {fr} from 'flatpickr/dist/l10n/fr.js';
import { createContainer } from 'meteor/react-meteor-data';
import { Button, Modal , Form, Message } from 'semantic-ui-react'

export default class MmoneysAdd extends React.Component {
    
    constructor(props) {
        super(props);
        this.state = {
            modalOpen: false,
            prestataire: '',
            ticket: '' ,
            dateTime: '' ,
            dateTimeV: '' ,
            nom: '' ,
            cni:'',
            phone:'',
            observations: '',
            error: ''
        };
    }
    onSubmit(e) {
        const { ticket ,prestataire, dateTime , dateTimeV , nom , cni, phone , observations } = this.state;

        e.preventDefault();

        if ( ticket && prestataire && dateTime && dateTimeV && nom && cni  && phone &&   observations ) {

            Meteor.call('mmoneys.insert', ticket.trim().toLowerCase() , prestataire , dateTime , dateTimeV , nom.trim().toLowerCase() , cni, phone.trim().toLowerCase() , observations.trim().toLowerCase()  , (err, res) => {
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
            ticket: '' ,
            prestataire: '' ,
            dateTime: '' ,
            dateTimeV: '' ,
            nom: '' ,
            cni:'',
            phone:'',
            observations: '',
            error:''
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

            <Modal
                closeIcon
                closeOnRootNodeClick={false}
                onSubmit={this.onSubmit.bind(this)}
                open={this.state.modalOpen}
                onClose={this.handleClose.bind(this)}
                size='small'
                trigger={<Button onClick={this.handleOpen.bind(this)} primary size='mini'>+ Ajouter 01 Mobile Money</Button>}>
                <Modal.Header>Ajouter 01 Mobile Money</Modal.Header>
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
                                <label>Date du paiement</label>
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

                            <div className='field'>
                                <label>Date du voyage</label>
                                <div className='ui input'>
                                    <Flatpickr
                                        as={Form.Field}
                                        data-enable-time
                                        onChange={ (startDate)  => {
                                            this.setState( { dateTimeV : startDate[0] } ) ;
                                            console.log(this.state.dateTimeV) ;
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


                        </Form.Group>

                        <Form.Group widths='equal'>

                            <Form.Input label='# de ticket'
                                        name='ticket'
                                        value={this.state.ticket}
                                        onChange={this.onChangeField.bind(this)}/>

                            <Form.Input label='Prestataire'
                                        name='prestataire'
                                        value={this.state.prestataire}
                                        onChange={this.onChangeField.bind(this)}/>

                        </Form.Group>

                        <Form.Group widths='equal'>

                            <Form.Input label='Nom et Prenom'
                                        name='nom'
                                        value={this.state.nom}
                                        onChange={this.onChangeField.bind(this)}/>

                        </Form.Group>


                        <Form.Group widths='equal'>

                            <Form.Input label='Destination'
                                        name='cni'
                                        value={this.state.cni}
                                        onChange={this.onChangeField.bind(this)}/>

                            <Form.Input label='Telephone'
                                        name='phone'
                                        value={this.state.phone}
                                        onChange={this.onChangeField.bind(this)}/>


                        </Form.Group>

                        <Form.TextArea label='Observations'
                                       name='observations'
                                       value={this.state.observations}
                                       onChange={this.onChangeField.bind(this)}/>
                        <Form.Button fluid basic color='blue'>Ajouter 01 Mobile Money</Form.Button>

                    </Form>

                </Modal.Content>
            </Modal>
        );
    }
}
