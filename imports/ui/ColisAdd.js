import React from 'react';
import { Meteor } from 'meteor/meteor';
import { Button, Modal , Form, Message } from 'semantic-ui-react'

export default class ColisAdd extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            code: '',
            dest: '',
            bus: '',
            nameExp: '',
            telExp: '',
            cniExp: '',
            nameDest: '',
            telDest: '',
            desc: '',
            amount: '',
            modalOpen: false,
            error: ''
        };
    }
    onSubmit(e) {
        const { code, bus, dest , amount, nameExp, telExp,nameDest, telDest, desc } = this.state;

        e.preventDefault();

        if ( code && bus && dest && amount && nameExp && telExp && nameDest && telDest && desc ) {

            Meteor.call('colis.insert', code.trim().toUpperCase(), bus.trim().toUpperCase() ,dest.trim().toUpperCase() , parseInt(amount.trim()) ,  nameExp.trim().toUpperCase(), telExp.trim(), nameDest.trim().toUpperCase(), telDest.trim(), desc.trim() , (err, res) => {
                if (!err) {
                    this.handleClose();
                    Bert.alert( 'Colis '+code+' ajoute avec succes.', 'danger', 'growl-top-right', 'fa-check'  )
                } else {
                    this.setState({ error: err.reason });
                }
            });

        } else {
            this.setState({ error: 'All field are required' });
        }
    }
    onChangeField(e, { name,value }) {
        this.setState( { [name] : value });
    }
    handleClose() {
        this.setState({
            modalOpen: false,
            code: '',
            dest: '',
            bus: '',
            nameExp: '',
            telExp: '',
            cniExp: '',
            nameDest: '',
            telDest: '',
            desc: '',
            amount: '',
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
                    dimmer='blurring'
                    size='small'
                    trigger={<Button onClick={this.handleOpen.bind(this)} fluid basic color='blue'>+ Ajouter un  colis</Button>}>
                    <Modal.Header>Ajouter un colis</Modal.Header>
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
                                <Form.Input label='Colis ID'
                                            name='code'
                                            value={this.state.code}
                                            onChange={this.onChangeField.bind(this)}/>
                                <Form.Input label='Bus'
                                            name='bus'
                                            value={this.state.bus}
                                            onChange={this.onChangeField.bind(this)}/>
                            </Form.Group>
                            <Form.Group widths='equal'>
                                <Form.Input label='Ville'
                                            name='dest'
                                            value={this.state.dest}
                                            onChange={this.onChangeField.bind(this)}/>
                                <Form.Input label='Montant'
                                            name='amount'
                                            value={this.state.amount}
                                            onChange={this.onChangeField.bind(this)}/>
                            </Form.Group>
                            <Form.Group widths='equal'>
                                <Form.Input label='Nom Expediteur'
                                            name='nameExp'
                                            value={this.state.nameExp}
                                            onChange={this.onChangeField.bind(this)}/>
                                <Form.Input label='Tel. Expediteur'
                                            name='telExp'
                                            value={this.state.telExp}
                                            placeholder = '237 obligatoire'
                                            onChange={this.onChangeField.bind(this)}/>
                            </Form.Group>
                            <Form.Group widths='equal'>
                                <Form.Input label='Nom Destinataire'
                                            name='nameDest'
                                            value={this.state.nameDest}
                                            onChange={this.onChangeField.bind(this)}/>
                                <Form.Input label='Tel. Destinataire'
                                            name='telDest'
                                            value={this.state.telDest}
                                            placeholder = '237 obligatoire'
                                            onChange={this.onChangeField.bind(this)}/>
                            </Form.Group>

                            <Form.TextArea label='Description'
                                           name='desc'
                                           value={this.state.desc}
                                           onChange={this.onChangeField.bind(this)}/>
                            <Form.Button fluid basic color='blue'>Enregistrer</Form.Button>
                        </Form>
                    </Modal.Content>
                </Modal>
            </div>
        );
    }
}
