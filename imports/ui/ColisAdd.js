import React from 'react';
import { Meteor } from 'meteor/meteor';
import { Button, Header, Image, Modal , Form, Input , Message } from 'semantic-ui-react'

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
    onChangeCode(e) {
        this.setState({
            code: e.target.value
        });
    }
    onChangeDest(e) {
        this.setState({
            dest: e.target.value
        });
    }
    onChangeBus(e) {
        this.setState({
            bus: e.target.value
        });
    }
    onChangeNameExp(e) {
        this.setState({
            nameExp: e.target.value
        });
    }
    onChangeTelExp(e) {
        this.setState({
            telExp: e.target.value
        });
    }
    onChangeCniExp(e) {
        this.setState({
            cniExp: e.target.value
        });
    }
    onChangeNameDest(e) {
        this.setState({
            nameDest: e.target.value
        });
    }
    onChangeTelDest(e) {
        this.setState({
            telDest: e.target.value
        });
    }
    onChangeDesc(e) {
        this.setState({
            desc: e.target.value
        });
    }
    onChangeAmount(e) {
        this.setState({
            amount: e.target.value
        });
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
                                <Form.Input label='Colis ID' value={this.state.code}
                                            onChange={this.onChangeCode.bind(this)}/>
                                <Form.Input label='Bus' value={this.state.bus}
                                            onChange={this.onChangeBus.bind(this)}/>
                            </Form.Group>
                            <Form.Group widths='equal'>
                                <Form.Input label='Ville' value={this.state.dest}
                                            onChange={this.onChangeDest.bind(this)}/>
                                <Form.Input label='Montant' value={this.state.amount}
                                            onChange={this.onChangeAmount.bind(this)}/>
                            </Form.Group>
                            <Form.Group widths='equal'>
                                <Form.Input label='Nom Expediteur' value={this.state.nameExp}
                                            onChange={this.onChangeNameExp.bind(this)}/>
                                <Form.Input label='Tel. Expediteur' value={this.state.telExp}
                                            placeholder = '237 obligatoire'
                                            onChange={this.onChangeTelExp.bind(this)}/>
                            </Form.Group>
                            <Form.Group widths='equal'>
                                <Form.Input label='Nom Destinataire' value={this.state.nameDest}
                                            onChange={this.onChangeNameDest.bind(this)}/>
                                <Form.Input label='Tel. Destinataire' value={this.state.telDest}
                                            placeholder = '237 obligatoire'
                                            onChange={this.onChangeTelDest.bind(this)}/>
                            </Form.Group>

                            <Form.TextArea label='Description' value={this.state.desc}
                                           onChange={this.onChangeDesc.bind(this)}/>
                            <Form.Button fluid basic color='blue'>Enregistrer</Form.Button>
                        </Form>
                    </Modal.Content>
                </Modal>
            </div>
        );
    }
}
