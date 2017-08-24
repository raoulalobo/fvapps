import React , { Component } from 'react';
import moment from 'moment';
import PropTypes from 'prop-types';
import { Session } from 'meteor/session';
import Flatpickr from 'react-flatpickr';
import {fr} from 'flatpickr/dist/l10n/fr.js';
import { Table, Button, Modal , Form, Message } from 'semantic-ui-react';
import { createContainer } from 'meteor/react-meteor-data';

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
        const { departId, dateTime, imm, dest , driver , fdr, amount, seat,leasing, km, obs } = this.state;

        e.preventDefault();

        if ( dateTime && imm && dest && driver && fdr && amount && seat && obs ) {

            Meteor.call('departs.modify', departId , dateTime instanceof Date ? dateTime : new Date(dateTime),   imm.trim().toUpperCase() , dest.trim().toLocaleLowerCase() ,driver.trim().toLocaleLowerCase() , parseInt(fdr) ,  parseInt(amount) , parseInt(seat) , parseInt(leasing) , parseInt(km) , obs.trim() , (err, res) => {
                if (!err) {
                    this.handleClose();
                    Bert.alert( 'enregistrement modifie avec succes.', 'danger', 'growl-top-right', 'fa-check'  )
                } else {
                    this.setState({ error: err.reason });
                }
            });

        } else {
            this.setState({ error: 'All field are required' });
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
            departId : this.props.depart._id,
            dateTime: this.props.depart.dateTime,
            imm: this.props.depart.imm,
            dest: this.props.depart.dest ? this.props.depart.dest : 'N.A',
            driver: this.props.depart.driver,
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
        if ( Roles.userIsInRole(this.state.currentUser, 'admin') ) {
            return (
                <Modal
                    onSubmit={this.onSubmit.bind(this)}
                    open={this.state.modalOpen}
                    onClose={this.handleClose.bind(this)}
                    size='small'
                    trigger={<Button onClick={this.handleOpen.bind(this)} primary size='mini'>Edit/Details</Button>}>
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
                                <Form.Input label='Destination'
                                            name='dest'
                                            value={this.state.dest}
                                            onChange={this.onChangeField.bind(this)}/>
                            </Form.Group>
                            <Form.Group widths='equal'>
                                <Form.Input label='Chauffeur'
                                            name='driver'
                                            value={this.state.driver}
                                            onChange={this.onChangeField.bind(this)}/>
                                <Form.Input label='FDR'
                                            name='fdr'
                                            value={this.state.fdr}
                                            onChange={this.onChangeField.bind(this)}/>
                                <Form.Input label='Prix place'
                                            name='amount'
                                            value={this.state.amount}
                                            onChange={this.onChangeField.bind(this)}/>
                            </Form.Group>
                            <Form.Group widths='equal'>
                                <Form.Input label='Nbr de places'
                                            name='seat'
                                            value={this.state.seat}
                                            onChange={this.onChangeField.bind(this)}/>
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
    render () {
        return (
            <Table.Row>
                <Table.Cell>{this.modifyButton()}</Table.Cell>
                <Table.Cell>{moment(this.props.depart.dateTime).format('lll')}</Table.Cell>
                <Table.Cell>{this.props.depart.imm}</Table.Cell>
                <Table.Cell>{this.props.depart.driver}</Table.Cell>
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
