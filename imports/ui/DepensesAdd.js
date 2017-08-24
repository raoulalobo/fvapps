import React from 'react';
import { Meteor } from 'meteor/meteor';
import Flatpickr from 'react-flatpickr';
import {fr} from 'flatpickr/dist/l10n/fr.js';
import { Button, Modal , Form, Message } from 'semantic-ui-react'

export default class DepensesAdd extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            modalOpen: false,
            dateTime: '',
            genre: '',
            code: '',
            desi: '',
            pu: '',
            qtte: '',
            notes: '',
            error: ''
        };
    }
    onSubmit(e) {
        const { dateTime, genre, code , desi , pu, qtte, notes } = this.state;

        e.preventDefault();

        if ( dateTime && genre && code && desi && pu && qtte && notes ) {

            Meteor.call('depenses.insert', dateTime , genre.trim().toUpperCase() ,code.trim().toUpperCase() ,desi.trim() , parseInt(pu) ,  parseInt(qtte) , notes.trim() , (err, res) => {
                if (!err) {
                    this.handleClose();
                    Bert.alert( 'depense ajoutee avec succes.', 'danger', 'growl-top-right', 'fa-check'  )
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
            dateTime: '',
            genre: '',
            code: '',
            desi: '',
            pu: '',
            qtte: '',
            notes: '',
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
                onSubmit={this.onSubmit.bind(this)}
                open={this.state.modalOpen}
                onClose={this.handleClose.bind(this)}
                size='small'
                trigger={<Button onClick={this.handleOpen.bind(this)} primary size='mini'>+ Ajouter une depense</Button>}>
                <Modal.Header>Ajouter une depense</Modal.Header>
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
                                <label>Date Heure</label>
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
                            <Form.Input label='Type de depense'
                                        name='genre'
                                        value={this.state.genre}
                                        onChange={this.onChangeField.bind(this)}/>
                            <Form.Input label='Code / Immatriculation'
                                        name='code'
                                        value={this.state.code}
                                        onChange={this.onChangeField.bind(this)}/>
                        </Form.Group>
                        <Form.Group widths='equal'>

                            <Form.Input label='Prix unitaire'
                                        name='pu'
                                        value={this.state.pu}
                                        onChange={this.onChangeField.bind(this)}/>
                            <Form.Input label='Quantite'
                                        name='qtte'
                                        value={this.state.qtte}
                                        onChange={this.onChangeField.bind(this)}/>
                        </Form.Group>

                        <Form.TextArea label='Designation'
                                       name='desi'
                                       value={this.state.desi}
                                       onChange={this.onChangeField.bind(this)}/>

                        <Form.TextArea label='Notes'
                                       name='notes'
                                       value={this.state.notes}
                                       onChange={this.onChangeField.bind(this)}/>
                        <Form.Button fluid basic color='blue'>Enregistrer</Form.Button>
                    </Form>
                </Modal.Content>
            </Modal>
        );
    }
}
