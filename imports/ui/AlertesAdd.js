import React from 'react';
import { Meteor } from 'meteor/meteor';
import Flatpickr from 'react-flatpickr';
import {fr} from 'flatpickr/dist/l10n/fr.js';
import { createContainer } from 'meteor/react-meteor-data';
import { Button, Modal , Form, Message } from 'semantic-ui-react'

export default class AlertesAdd extends React.Component {

    constructor(props) {
        super(props);
        this.state = {
            modalOpen: false,
            type: '',
            code: '',
            immatriculation: '' ,
            validite: '' ,
            observations: '',
            error: ''
        };
    }
    onSubmit(e) {
        const { immatriculation ,type, code,  validite , observations } = this.state;

        e.preventDefault();

        if ( immatriculation && type && code && validite &&   observations ) {

            Meteor.call('alertes.insert', type , code.trim().toLowerCase() ,  immatriculation.trim().toLowerCase() , validite , observations.trim().toLowerCase()  , (err, res) => {
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
            type: '' ,
            code: '' ,
            immatriculation: '' ,
            validite: '' ,
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
        const options = [
            { key: 'a', text: 'Assurance', value: 'assurance' },
            { key: 'cg', text: 'Carte Grise', value: 'carte grise' },
            { key: 'cb', text: 'Carte Bleue', value: 'carte bleue' },
            { key: 'vt', text: 'Visite Technique', value: 'visite technique' },
            { key: 'l', text: 'Licenses', value: 'licenses' },
            { key: 'p', text: 'Patentes', value: 'patentes' },
        ]

        return (

            <Modal
                closeIcon
                closeOnRootNodeClick={false}
                onSubmit={this.onSubmit.bind(this)}
                open={this.state.modalOpen}
                onClose={this.handleClose.bind(this)}
                size='small'
                trigger={<Button onClick={this.handleOpen.bind(this)} primary size='mini'>+ Ajouter 01 alerte</Button>}>
                <Modal.Header>Ajouter 01 alerte</Modal.Header>
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
                                <label>Date de validite</label>
                                <div className='ui input'>
                                    <Flatpickr
                                        as={Form.Field}
                                        data-enable-time
                                        onChange={ (startDate)  => {
                                            this.setState( { validite : startDate[0] } ) ;
                                            console.log(this.state.validite) ;
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

                            <Form.Input label='Code'
                                        name='code'
                                        value={this.state.code}
                                        onChange={this.onChangeField.bind(this)}/>

                        </Form.Group>

                        <Form.Group widths='equal'>

                            <Form.Input label='Immatriculation'
                                        name='immatriculation'
                                        value={this.state.immatriculation}
                                        onChange={this.onChangeField.bind(this)}/>

                            <Form.Dropdown
                                label='Type alerte'
                                minCharacters={0}
                                name='type'
                                placeholder='Selectionnez 01 alerte'
                                search
                                selection
                                options={options}
                                onChange={this.onChangeField.bind(this)}/>

                        </Form.Group>

                        <Form.TextArea label='Observations'
                                       name='observations'
                                       value={this.state.observations}
                                       onChange={this.onChangeField.bind(this)}/>
                        <Form.Button fluid basic color='blue'>Ajouter 01 alerte</Form.Button>

                    </Form>

                </Modal.Content>
            </Modal>
        );
    }
}
