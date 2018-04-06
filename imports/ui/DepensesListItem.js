import React , { Component } from 'react';
import moment from 'moment';
import PropTypes from 'prop-types';
import { Session } from 'meteor/session';
import Flatpickr from 'react-flatpickr';
import {fr} from 'flatpickr/dist/l10n/fr.js';
import { Table, Button, Modal , Form, Message, Icon } from 'semantic-ui-react';
import { createContainer } from 'meteor/react-meteor-data';

export class DepensesListItem extends Component {

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
        const { depenseId, dateTime, genre, code , desi , pu, qtte, notes } = this.state;

        e.preventDefault();

        if ( dateTime && genre && code && desi && pu && qtte && notes ) {

            let DCB = new RegExp('dcb','i');
            let resultat = DCB.test( genre );

            if ( !resultat) {
                Meteor.call('depenses.modify', depenseId , dateTime instanceof Date ? dateTime : new Date(dateTime),   genre.trim().toUpperCase() , code.trim().toUpperCase() ,desi.trim() , parseInt(pu) ,  parseInt(qtte) , notes.trim() , (err, res) => {
                    if (!err) {
                        this.handleClose();
                        Bert.alert( 'enregistrement modifie avec succes.', 'danger', 'growl-top-right', 'fa-check'  )
                    } else {
                        this.setState({ error: err.reason });
                    }
                });

            } else {
                this.setState({ error: 'Impossible de modifier les DCB dans cette section' });
            }



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
            depenseId : this.props.depense._id,
            dateTime: this.props.depense.dateTime,
            genre: this.props.depense.genre,
            code: this.props.depense.code ,
            desi: this.props.depense.desi,
            pu: this.props.depense.pu,
            qtte: this.props.depense.qtte,
            notes: this.props.depense.notes,
            error: ''
        } );
    }
    modifyButton () {
        let DCB = new RegExp('dcb','i');
        let resultat = DCB.test( this.props.depense.genre );

        if ( Roles.userIsInRole(this.state.currentUser, ['admin','caisse']) ) {

            return (
                <Modal
                    onSubmit={this.onSubmit.bind(this)}
                    open={this.state.modalOpen}
                    onClose={this.handleClose.bind(this)}
                    size='small'
                    trigger={<Button onClick={this.handleOpen.bind(this)} primary size='mini'icon><Icon name='write' /></Button>}>
                    <Modal.Header>Modifier</Modal.Header>
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
            )
        }
    }
    deleteButton () {
        let DCB = new RegExp('dcb','i');
        let resultat = DCB.test( this.props.depense.genre );
        if ( Roles.userIsInRole(this.state.currentUser, ['admin','caisse']) ) {
            return (
                <Button onClick={this.onDelete.bind(this)} color='red' size='mini' icon>
                    <Icon name='trash'/>
                </Button>
            )
        }
    }
    onDelete(e){

        e.preventDefault();

        let DCB = new RegExp('dcb','i');
        let resultat = DCB.test( this.props.depense.genre );

        if ( this.props.depense._id && !resultat  ) {

            const suppression = confirm(`Voulez vous supprimer la depense code: ${this.props.depense.code}, designation: ${this.props.depense.desi}, date : ${moment(this.props.depense.dateTime).format('lll')} ?`);
            if (suppression) {
                Meteor.call('depenses.delete', this.props.depense._id , (err, res) => {
                    if (!err) {
                        Bert.alert( 'element supprime avec succes.', 'danger', 'growl-top-right', 'fa-check'  )
                    } else {
                        Bert.alert( `erreur : ${err}`, 'danger', 'growl-top-right', 'fa-close'  )
                    }
                })
            }

        } else {
            Bert.alert( 'erreur inatendue reessayez.', 'danger', 'growl-top-right', 'fa-close'  )
        }
    }
    render () {
        return (
            <Table.Row>
                <Table.Cell>{this.modifyButton()} {this.deleteButton()}</Table.Cell>
                <Table.Cell>{moment(this.props.depense.dateTime).format('lll')}</Table.Cell>
                <Table.Cell>{this.props.depense.genre}</Table.Cell>
                <Table.Cell>{this.props.depense.code}</Table.Cell>
                <Table.Cell>{this.props.depense.desi.slice(0,15)}...</Table.Cell>
                <Table.Cell>{this.props.depense.pu}</Table.Cell>
                <Table.Cell>{this.props.depense.qtte}</Table.Cell>
                <Table.Cell>{this.props.depense.total}</Table.Cell>
                <Table.Cell>{this.props.depense.notes.slice(0,8)}...</Table.Cell>
            </Table.Row>
        );
    }


};

DepensesListItem.propTypes = {
    depense: PropTypes.object.isRequired,
    Session: PropTypes.object.isRequired
};

export default createContainer(() => {

    const user = Meteor.user() || null;
    return {
        Session,
        user,
        call: Meteor.call,
    };
}, DepensesListItem);
