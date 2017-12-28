import React from 'react';
import { Meteor } from 'meteor/meteor';
import Flatpickr from 'react-flatpickr';
import {fr} from 'flatpickr/dist/l10n/fr.js';
import { createContainer } from 'meteor/react-meteor-data';
import { Button, Modal , Form, Message } from 'semantic-ui-react'

export default class HotessesAdd extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            modalOpen: false,
            dateNaissance: '' ,
            nom: '' ,
            cni:'',
            phone1:'',
            phone2:'',
            permis:'',
            observations: '',
            error: ''
        };
    }
    onSubmit(e) {
        const { dateNaissance, nom , cni, phone1 , phone2 , permis , observations } = this.state;

        e.preventDefault();

        if ( dateNaissance && nom && cni  && phone1 &&  phone2 && permis && observations ) {

            const identifiant = new Date().getTime()+nom.trim().toLowerCase().replace(/[ ]/g, "_").replace(/[']/g, "+");
            
            console.log( identifiant ) ;
            
            Meteor.call('hotesses.insert', dateNaissance , nom.trim().toLowerCase() , cni, phone1.trim().toLowerCase() , phone2.trim().toLowerCase() , permis.trim().toLowerCase() , observations.trim().toLowerCase()  , (err, res) => {
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
            dateNaissance: '' ,
            nom: '' ,
            cni:'',
            phone1:'',
            phone2:'',
            permis:'',
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
                trigger={<Button onClick={this.handleOpen.bind(this)} primary size='mini'>+ Ajouter 01 hotesse</Button>}>
                <Modal.Header>Ajouter 01 hotesse</Modal.Header>
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
                                <label>Date Naissance</label>
                                <div className='ui input'>
                                    <Flatpickr
                                        as={Form.Field}
                                        data-enable-time
                                        onChange={ (startDate)  => {
                                            this.setState( { dateNaissance : startDate[0] } ) ;
                                            console.log(this.state.dateNaissance) ;
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
                            <Form.Input label='Nom et Prenom'
                                        name='nom'
                                        value={this.state.nom}
                                        onChange={this.onChangeField.bind(this)}/>

                        </Form.Group>

                        <Form.Group widths='equal'>

                            <Form.Input label='CNI'
                                        name='cni'
                                        value={this.state.cni}
                                        onChange={this.onChangeField.bind(this)}/>
                            <Form.Input label='Permis de conduire'
                                        name='permis'
                                        value={this.state.permis}
                                        onChange={this.onChangeField.bind(this)}/>
                        </Form.Group>

                        <Form.Group widths='equal'>

                            <Form.Input label='Telephone #1'
                                        name='phone1'
                                        value={this.state.phone1}
                                        onChange={this.onChangeField.bind(this)}/>
                            <Form.Input label='Telephone #2'
                                        name='phone2'
                                        value={this.state.phone2}
                                        onChange={this.onChangeField.bind(this)}/>
                        </Form.Group>

                        <Form.TextArea label='Observations'
                                       name='observations'
                                       value={this.state.observations}
                                       onChange={this.onChangeField.bind(this)}/>
                        <Form.Button fluid basic color='blue'>Ajouter et creer 01 hotesse</Form.Button>

                    </Form>
                </Modal.Content>
            </Modal>
        );
    }
}
