import React , { Component } from 'react';
import moment from 'moment';
import PropTypes from 'prop-types';
import { Session } from 'meteor/session';
import Flatpickr from 'react-flatpickr';
import {fr} from 'flatpickr/dist/l10n/fr.js';
import { Table, Button, Modal , Form, Message, Icon } from 'semantic-ui-react';
import { createContainer } from 'meteor/react-meteor-data';
import {Meteor} from "meteor/meteor";

export class DepartsListItem extends Component {

    constructor (props) {
        super(props);
        this.state = {
            currentUser : Meteor.user(),
            modalOpen : false,
        }
    }
    componentWillReceiveProps(nextProps) {
        const { user } = nextProps;
        if (user) {
            this.setState({currentUser: user._id});
        }
    }
    onChangeField(e, { name,value }) {
        this.setState( { [name] : value });
        console.log(`${name} -> ${value}`)
    }
    onSubmit(e){
        const { depenseId , departId, dateTime, imm, dest , driver , fuel, fdr, amount, seat,leasing, km, obs } = this.state;

        e.preventDefault();

        if ( dateTime && imm && dest && driver && fdr && amount && seat && obs ) {

            Meteor.call('departs.modify', departId , dateTime instanceof Date ? dateTime : new Date(dateTime),   imm.trim().toUpperCase() , dest.trim().toLocaleLowerCase() ,driver.trim().toLocaleLowerCase() , parseInt(fuel) , parseInt(fdr) ,  parseInt(amount) , parseInt(seat) , parseInt(leasing) , parseInt(km) , obs.trim() , (err, res) => {
                if (!err) {
                    this.handleClose();

                    Bert.alert( 'enregistrement ajoute avec succes.', 'danger', 'growl-top-right', 'fa-check'  )

                    if( parseInt(fuel) > 0 ){

                        Meteor.call('depenses.modify', depenseId, dateTime instanceof Date ? dateTime : new Date(dateTime) , 'DCB' , imm.trim().toUpperCase() , 'Carburant bus' , 635 ,  parseInt(fuel) , 'RAS' , true, (err, res) => {
                            if (!err) {
                                this.handleClose();
                                Bert.alert( 'depense ajoutee avec succes.', 'danger', 'growl-top-right', 'fa-check'  )
                            } else {
                                this.setState({ error: err.reason });
                            }
                        });

                    } else {

                        Meteor.call('depenses.modify', depenseId, dateTime instanceof Date ? dateTime : new Date(dateTime) , 'DCB' , imm.trim().toUpperCase() , 'Carburant bus' , 635 ,  parseInt(fuel) , 'RAS' , false, (err, res) => {
                            if (!err) {
                                this.handleClose();
                                Bert.alert( 'depense ajoutee avec succes.', 'danger', 'growl-top-right', 'fa-check'  )
                            } else {
                                this.setState({ error: err.reason });
                            }
                        });

                    }

                } else {
                    this.setState({ error: err.reason });
                }
            });

        } else {
            this.setState({ error: 'All field are required' });
        }
    }
    onDelete(e){

        e.preventDefault();
        if ( this.props.depart._id ) {

            const suppression = confirm(`Voulez vous supprimer le depart du bus: ${this.props.depart.imm}, destination: ${this.props.depart.dest}, date: ${moment(this.props.depart.dateTime).format('lll')} ?`);

            if (suppression) {
                Meteor.call('departs.delete', this.props.depart._id , (err, res) => {
                    if (!err) {

                        Meteor.call('depenses.delete', this.props.depart.depenseId , (err, res) => {
                            if (!err) {
                                Bert.alert( 'element supprime avec succes.', 'danger', 'growl-top-right', 'fa-check'  )
                            } else {
                                Bert.alert( `erreur : ${err}`, 'danger', 'growl-top-right', 'fa-close'  )
                            }
                        });

                    } else {
                        Bert.alert( `erreur : ${err}`, 'danger', 'growl-top-right', 'fa-close'  );
                    }
                })
            }

        } else {
            Bert.alert( 'erreur inatendue reessayez.', 'danger', 'growl-top-right', 'fa-close'  )
        }
    }
    handleClose(){
        this.setState({
            modalOpen: false,
            error: ''
        });
    }
    handleOpen(){
        this.setState( {
            modalOpen: true,
            depenseId: !!this.props.depart.depenseId ? this.props.depart.depenseId : 'N.A' ,
            departId : this.props.depart._id,
            dateTime: this.props.depart.dateTime,
            imm: this.props.depart.imm,
            dest: this.props.depart.dest ? this.props.depart.dest : 'N.A',
            driver: this.props.depart.driver,
            fuel: !!this.props.depart.fuel ? this.props.depart.fuel : 0 ,
            fdr: this.props.depart.fdr,
            amount: this.props.depart.amount,
            seat: this.props.depart.seats,
            leasing: this.props.depart.leasing,
            km: this.props.depart.km,
            obs: this.props.depart.obs,
            error: ''
        } );
    }
    modifyButton () {
        if ( Roles.userIsInRole(this.state.currentUser, ['admin','caisse']) ) {
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
                    trigger={<Button onClick={this.handleOpen.bind(this)} primary size='mini' icon><Icon name='write' /></Button>}>
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
                                                    defaultDate: new Date(this.state.dateTime),
                                                    altInput: true,
                                                    time_24hr: true,
                                                    locale : fr
                                                }
                                            }
                                        />
                                    </div>
                                </div>
                                <Form.Input label='Immatriclation'
                                            name='imm'
                                            value={this.state.imm}
                                            onChange={this.onChangeField.bind(this)}/>

                            </Form.Group>

                            <Form.Group widths='equal'>

                                <Form.Dropdown
                                    label='Destination'
                                    minCharacters={0}
                                    name='dest'
                                    placeholder='Selectionnez 01 Destination'
                                    search
                                    selection
                                    options={options}
                                    defaultValue={this.state.dest}
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
            )
        }
    }
    deleteButton () {
        if ( Roles.userIsInRole(this.state.currentUser, ['admin','caisse']) ) {
            return (
                <Button onClick={this.onDelete.bind(this)} color='red' size='mini' icon>
                    <Icon name='trash'/>
                </Button>
            )
        }
    }
    render () {
        return (
            <Table.Row>
                <Table.Cell>{this.modifyButton()} {this.deleteButton()}</Table.Cell>
                <Table.Cell>{moment(this.props.depart.dateTime).format('lll')}</Table.Cell>
                <Table.Cell>{this.props.depart.imm}</Table.Cell>
                <Table.Cell>{this.props.depart.driver}</Table.Cell>
                <Table.Cell>{!!this.props.depart.fuel ? this.props.depart.fuel : 0 }</Table.Cell>
                <Table.Cell>{this.props.depart.fdr}</Table.Cell>
                <Table.Cell>{this.props.depart.amount}</Table.Cell>
                <Table.Cell>{this.props.depart.seats}</Table.Cell>
                <Table.Cell>{this.props.depart.total}</Table.Cell>
                <Table.Cell>{this.props.depart.dest ? this.props.depart.dest : 'N.A'}</Table.Cell>
                <Table.Cell>{this.props.depart.obs}</Table.Cell>
            </Table.Row>
        );
    }


};

DepartsListItem.propTypes = {
    depart: PropTypes.object.isRequired,
    Session: PropTypes.object.isRequired
};

export default createContainer(() => {

    const user = Meteor.user() || null;
    return {
        Session,
        user,
        call: Meteor.call,
    };
}, DepartsListItem);
