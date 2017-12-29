import React from 'react';
import { Meteor } from 'meteor/meteor';
import Flatpickr from 'react-flatpickr';
import {fr} from 'flatpickr/dist/l10n/fr.js';
import { createContainer } from 'meteor/react-meteor-data';
import { Button, Modal , Form, Message } from 'semantic-ui-react'

export default class VidangesAdd extends React.Component {

    constructor(props) {
        super(props);
        this.state = {
            modalOpen: false,
            ordre: '' ,
            immatriculation: '' ,
            dateTime: '' ,
            type: '' ,
            last:'',
            nbrVoyageSimple:'',
            nbrVoyageComplete:'',
            observations: '',
            error: ''
        };
    }
    onSubmit(e) {
        const { ordre , immatriculation, dateTime , type , last , nbrVoyageSimple, nbrVoyageComplete , observations } = this.state;

        e.preventDefault();

        if ( ordre && immatriculation && dateTime && type && last && nbrVoyageSimple  && nbrVoyageComplete &&   observations ) {

            Meteor.call('vidanges.insert', ordre , immatriculation, dateTime , type , last , nbrVoyageSimple, nbrVoyageComplete , observations.trim().toLowerCase()  , (err, res) => {
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
            ordre: '' ,
            immatriculation: '' ,
            dateTime: '' ,
            type: '' ,
            last:'',
            nbrVoyageSimple:'',
            nbrVoyageComplete:'',
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

        return (

            <Modal
                closeIcon
                closeOnRootNodeClick={false}
                onSubmit={this.onSubmit.bind(this)}
                open={this.state.modalOpen}
                onClose={this.handleClose.bind(this)}
                size='small'
                trigger={<Button onClick={this.handleOpen.bind(this)} primary size='mini'>+ Ajouter 01 vidange</Button>}>
                <Modal.Header>Ajouter 01 vidange</Modal.Header>
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
                                <label>Date vidange</label>
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

                            <Form.Input label='Immatriculation'
                                        name='immatriculation'
                                        value={this.state.immatriculation}
                                        onChange={this.onChangeField.bind(this)}/>

                        </Form.Group>

                        <Form.Group widths='equal'>

                            <Form.Input label='Type de vidange'
                                        name='type'
                                        value={this.state.type}
                                        onChange={this.onChangeField.bind(this)}/>

                            <Form.Input label='Derniere vidange'
                                        name='last'
                                        value={this.state.last}
                                        onChange={this.onChangeField.bind(this)}/>

                        </Form.Group>


                        <Form.Group widths='equal'>

                            <Form.Input label='Nbr voyages simples'
                                        name='cni'
                                        value={this.state.nbrVoyageSimple}
                                        onChange={this.onChangeField.bind(this)}/>

                            <Form.Input label='Nbr voyages completes'
                                        name='phone'
                                        value={this.state.nbrVoyageComplete}
                                        onChange={this.onChangeField.bind(this)}/>


                        </Form.Group>

                        <Form.TextArea label='Observations'
                                       name='observations'
                                       value={this.state.observations}
                                       onChange={this.onChangeField.bind(this)}/>
                        <Form.Button fluid basic color='blue'>Ajouter 01 vidange</Form.Button>

                    </Form>

                </Modal.Content>
            </Modal>
        );
    }
}
