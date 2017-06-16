import React from 'react';
import { Meteor } from 'meteor/meteor';
import Flatpickr from 'react-flatpickr';
import {fr} from 'flatpickr/dist/l10n/fr.js';
import { Button, Modal , Form , Message } from 'semantic-ui-react'

export default class ResaAdd extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            resa: '',
            cni: '',
            phone: '',
            name: '',
            desc: '',
            modalOpen: false,
            error: ''
        };
    }
    onSubmit(e) {
        const { resa , cni , phone , name , desc } = this.state;

        e.preventDefault();

        if ( resa && phone && name && desc ) {

            Meteor.call('resas.insert', resa.getTime() , cni.trim().toUpperCase() , phone , name.trim().toUpperCase() , desc , (err, res) => {
                if (!err) {
                    this.handleClose();
                    Bert.alert( 'Reservation ajoutee avec succes.', 'danger', 'growl-top-right', 'fa-check'  )
                } else {
                    this.setState({ error: err.reason });
                }
            });

        } else {
            this.setState({ error: 'All field are required' });
        }
    }
    onChangeCNI(e) {
        this.setState({
            cni : e.target.value
        });
    }
    onChangePhone(e) {
        this.setState({
            phone : e.target.value
        });
    }
    onChangeName(e) {
        this.setState({
            name : e.target.value
        });
    }
    onChangeDesc(e) {
        this.setState({
            desc: e.target.value
        });
    }
    handleClose() {
        this.setState({
            modalOpen: false,
            resa: '',
            cni: '',
            phone: '',
            name: '',
            desc: '',
            error: ''
        });
    }
    handleOpen() {
        this.setState( { modalOpen: true } );
    }
    render() {

        return (
            <div className="mrgnButton">

                <Modal
                    onSubmit={this.onSubmit.bind(this)}
                    open={this.state.modalOpen}
                    onClose={this.handleClose.bind(this)}
                    size='small'
                    trigger={<Button onClick={this.handleOpen.bind(this)} fluid basic color='blue'>+ Ajouter une resa</Button>}>
                    <Modal.Header>Ajouter une resa </Modal.Header>
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
                                    <label>Date</label>
                                    <div className='ui input'>
                                        <Flatpickr
                                            as={Form.Field}
                                            data-enable-time
                                            onChange={ (startDate)  => {
                                                this.setState( { resa : startDate[0] } ) ;
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
                                <Form.Input label='CNI' value={this.state.cni}
                                            onChange={this.onChangeCNI.bind(this)}/>
                            </Form.Group>
                            <Form.Group widths='equal'>
                                <Form.Input label='Telephone' value={this.state.phone}
                                            placeholder = '237 obligatoire'
                                            onChange={this.onChangePhone.bind(this)}/>
                                <Form.Input label='Nom' value={this.state.name}
                                            onChange={this.onChangeName.bind(this)}/>
                            </Form.Group>

                            <Form.TextArea label='Observations' value={this.state.desc}
                                           onChange={this.onChangeDesc.bind(this)}/>
                            <Form.Button fluid basic color='blue'>Enregistrer</Form.Button>
                        </Form>
                    </Modal.Content>
                </Modal>
            </div>
        );
    }
}
