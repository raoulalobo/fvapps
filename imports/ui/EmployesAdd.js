import React from 'react';
import { Meteor } from 'meteor/meteor';
import Flatpickr from 'react-flatpickr';
import {fr} from 'flatpickr/dist/l10n/fr.js';
import { Button, Modal , Form, Message } from 'semantic-ui-react'

export default class EmployesAdd extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            modalOpen: false,
            nom: '',
            bithday: '',
            cni: '',
            phone: '',
            scan: '',
            enfants: '',
            embauche: '',
            contrat: '',
            assurance: '',
            service: '',
            salaire: '',
            observations: '',
            error: ''
        };
    }
    onSubmit(e) {
        const { nom, bday, cni , phone, scan ,enfants, embauche, contrat, assurance,service, salaire, observations } = this.state;

        e.preventDefault();

        if ( nom  ) {

            Meteor.call('employes.insert', nom , bday , cni.trim().toLocaleLowerCase() , phone, scan.trim().toLocaleLowerCase(), parseInt(enfants.trim()) ,embauche , contrat.trim().toLocaleLowerCase() , assurance.trim().toLocaleLowerCase() ,service.trim().toLocaleLowerCase() , parseInt(salaire.trim())  , observations.trim() , (err, res) => {
                if (!err) {
                    this.handleClose();

                    Bert.alert( 'enregistrement ajoute avec succes.', 'danger', 'growl-top-right', 'fa-check'  )

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
            nom: '',
            bday: '',
            cni: '',
            phone: '',
            scan: '',
            enfants: '',
            embauche: '',
            contrat: '',
            assurance: '',
            service: '',
            salaire: '',
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
            { key: 'y', text: 'yaounde', value: 'yaounde' },
            { key: 'd', text: 'douala', value: 'douala' },
        ]
        return (

            <Modal
                onSubmit={this.onSubmit.bind(this)}
                open={this.state.modalOpen}
                onClose={this.handleClose.bind(this)}
                size='small'
                trigger={<Button onClick={this.handleOpen.bind(this)} primary size='mini'>+ Ajouter un employe</Button>}>
                <Modal.Header>Ajouter un employe</Modal.Header>
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

                            <Form.Input label='Noms et prenoms'
                                        name='nom'
                                        value={this.state.nom}
                                        onChange={this.onChangeField.bind(this)}/>

                        </Form.Group>

                        <Form.Group widths='equal'>
                            <div className='field'>
                                <label>Date naissance</label>
                                <div className='ui input'>
                                    <Flatpickr
                                        as={Form.Field}
                                        data-enable-time
                                        onChange={ (startDate)  => {
                                            this.setState( { bday : startDate[0] } ) ;
                                            console.log(this.state.bday) ;
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
                            <Form.Input label='Telephone'
                                        name='phone'
                                        value={this.state.phone}
                                        onChange={this.onChangeField.bind(this)}/>

                        </Form.Group>

                        <Form.Group widths='equal'>

                            <Form.Input label='CNI'
                                        name='cni'
                                        value={this.state.cni}
                                        onChange={this.onChangeField.bind(this)}/>

                            <Form.Input label='Scan'
                                        name='scan'
                                        value={this.state.scan}
                                        onChange={this.onChangeField.bind(this)}/>
                        </Form.Group>

                        <Form.Group widths='equal'>
                            <Form.Input label='Enfants'
                                        name='enfants'
                                        value={this.state.enfants}
                                        onChange={this.onChangeField.bind(this)}/>

                            <div className='field'>
                                <label>Date embauche</label>
                                <div className='ui input'>
                                    <Flatpickr
                                        as={Form.Field}
                                        data-enable-time
                                        onChange={ (startDate)  => {
                                            this.setState( { embauche : startDate[0] } ) ;
                                            console.log(this.state.embauche) ;
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
                            <Form.Input label='Contrat'
                                        name='contrat'
                                        value={this.state.contrat}
                                        onChange={this.onChangeField.bind(this)}/>
                            <Form.Input label='Assurance'
                                        name='assurance'
                                        value={this.state.assurance}
                                        onChange={this.onChangeField.bind(this)}/>

                        </Form.Group>

                        <Form.Group widths='equal'>
                            <Form.Input label='Service'
                                        name='service'
                                        value={this.state.service}
                                        onChange={this.onChangeField.bind(this)}/>
                            <Form.Input label='Salaire'
                                        name='salaire'
                                        value={this.state.salaire}
                                        onChange={this.onChangeField.bind(this)}/>
                        </Form.Group>


                        <Form.TextArea label='Observations'
                                       name='observations'
                                       value={this.state.obs}
                                       onChange={this.onChangeField.bind(this)}/>
                        <Form.Button fluid basic color='blue'>Enregistrer</Form.Button>
                    </Form>
                </Modal.Content>
            </Modal>
        );
    }
}
