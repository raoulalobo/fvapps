import React from 'react';
import { Meteor } from 'meteor/meteor';
import Flatpickr from 'react-flatpickr';
import {fr} from 'flatpickr/dist/l10n/fr.js';
import { Button, Modal , Form, Message } from 'semantic-ui-react'

export default class DepartsAdd extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            modalOpen: false,
            dateTime: '',
            imm: '',
            dest: '',
            driver: '',
            fuel: '',
            fdr: '',
            amount: '',
            seat: '',
            leasing: '',
            km: '',
            obs: '',
            error: ''
        };
    }
    onSubmit(e) {
        const { dateTime, imm, dest , driver ,fuel, fdr, amount, seat,leasing, km, obs } = this.state;

        e.preventDefault();

        if ( dateTime && imm && dest && driver && fuel && fdr && amount && seat && leasing && km && obs ) {

            if( parseInt(fuel.trim()) > 0 ){

                Meteor.call('depenses.insert', dateTime , 'DCB' , imm.trim().toUpperCase() , 'Carburant bus' , 635 ,  parseInt(fuel.trim()) , 'RAS' , true, (err, res) => {
                    if (!err) {
                        this.handleClose();
                        Bert.alert( `depense ${res} ajoutee avec succes.`, 'danger', 'growl-top-right', 'fa-check'  );

                        Meteor.call('departs.insert', res, dateTime , imm.trim().toUpperCase() ,dest.trim().toLocaleLowerCase() ,driver.trim().toLocaleLowerCase() , parseInt(fuel.trim()), parseInt(fdr.trim()) ,  parseInt(amount.trim()) , parseInt(seat.trim()) , parseInt(leasing.trim()) , parseInt(km.trim()) , obs.trim() , (err, res) => {
                            if (!err) {
                                this.handleClose();

                                Bert.alert( 'enregistrement ajoute avec succes.', 'danger', 'growl-top-right', 'fa-check'  )

                            } else {
                                this.setState({ error: err.reason });
                            }
                        });
                    } else {
                        this.setState({ error: err.reason });
                    }
                });
            } else {

                Meteor.call('depenses.insert', dateTime , 'DCB' , imm.trim().toUpperCase() , 'Carburant bus' , 635 ,  parseInt(fuel.trim()) , 'RAS' , false, (err, res) => {
                    if (!err) {
                        this.handleClose();
                        Bert.alert( `depense ${res} ajoutee avec succes.`, 'danger', 'growl-top-right', 'fa-check'  );

                        Meteor.call('departs.insert', res, dateTime , imm.trim().toUpperCase() ,dest.trim().toLocaleLowerCase() ,driver.trim().toLocaleLowerCase() , parseInt(fuel.trim()), parseInt(fdr.trim()) ,  parseInt(amount.trim()) , parseInt(seat.trim()) , parseInt(leasing.trim()) , parseInt(km.trim()) , obs.trim() , (err, res) => {
                            if (!err) {
                                this.handleClose();

                                Bert.alert( 'enregistrement ajoute avec succes.', 'danger', 'growl-top-right', 'fa-check'  )

                            } else {
                                this.setState({ error: err.reason });
                            }
                        });
                    } else {
                        this.setState({ error: err.reason });
                    }
                });

            }


        } else {
            this.setState({ error: 'All field are required' });
        }
    }
    handleClose() {
        this.setState({
            modalOpen: false,
            dateTime: '',
            imm: '',
            dest: '',
            driver: '',
            fuel: '',
            fdr: '',
            amount: '',
            seat: '',
            leasing: '',
            km: '',
            obs: '',
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
                    trigger={<Button onClick={this.handleOpen.bind(this)} primary size='mini'>+ Ajouter un depart</Button>}>
                    <Modal.Header>Ajouter un depart</Modal.Header>
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
                                <Form.Input label='Immatriculation'
                                            name='imm'
                                            value={this.state.imm}
                                            onChange={this.onChangeField.bind(this)}/>

                            </Form.Group>

                            <Form.Group widths='equal'>

                                <Form.Dropdown
                                    label='Destination'
                                    minCharacters={0}
                                    name='dest'
                                    placeholder='Selectionnez la destination'
                                    search
                                    selection
                                    options={options}
                                    onChange={this.onChangeField.bind(this)}/>

                                <Form.Input label='Chauffeur'
                                            name='driver'
                                            value={this.state.driver}
                                            onChange={this.onChangeField.bind(this)}/>
                            </Form.Group>

                            <Form.Group widths='equal'>
                                <Form.Input label='Carburant'
                                            name='fuel'
                                            value={this.state.fuel}
                                            onChange={this.onChangeField.bind(this)}/>
                                <Form.Input label='FDR'
                                            name='fdr'
                                            value={this.state.fdr}
                                            onChange={this.onChangeField.bind(this)}/>


                            </Form.Group>

                            <Form.Group widths='equal'>
                                <Form.Input label='Prix place'
                                            name='amount'
                                            value={this.state.amount}
                                            onChange={this.onChangeField.bind(this)}/>
                                <Form.Input label='Nbr de places'
                                            name='seat'
                                            value={this.state.seat}
                                            onChange={this.onChangeField.bind(this)}/>

                            </Form.Group>

                            <Form.Group widths='equal'>
                                <Form.Input label='Location'
                                            name='leasing'
                                            value={this.state.leasing}
                                            onChange={this.onChangeField.bind(this)}/>
                                <Form.Input label='Kilometrage'
                                            name='km'
                                            value={this.state.km}
                                            onChange={this.onChangeField.bind(this)}/>
                            </Form.Group>


                            <Form.TextArea label='Observations'
                                           name='obs'
                                           value={this.state.obs}
                                           onChange={this.onChangeField.bind(this)}/>
                            <Form.Button fluid basic color='blue'>Enregistrer</Form.Button>
                        </Form>
                    </Modal.Content>
                </Modal>
        );
    }
}
