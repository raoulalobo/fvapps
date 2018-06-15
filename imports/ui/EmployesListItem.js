import React , { Component } from 'react';
import moment from 'moment';
import PropTypes from 'prop-types';
import { Session } from 'meteor/session';
import Flatpickr from 'react-flatpickr';
import {fr} from 'flatpickr/dist/l10n/fr.js';
import { Table, Button, Modal , Form, Message, Icon } from 'semantic-ui-react';
import { createContainer } from 'meteor/react-meteor-data';
import {Meteor} from "meteor/meteor";

export class EmployesListItem extends Component {

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
        const { employeId, nom , birtday, cni, phone, scan , enfants , embauche, contrat, assurance, service,salaire, km, observations } = this.state;

        e.preventDefault();

        if ( nom && birtday && cni && scan && enfants && embauche && contrat && assurance && service && salaire && observations ) {

            Meteor.call('employes.modify',employeId, nom, birtday instanceof Date ? birtday : new Date(birtday) , cni.trim().toLocaleLowerCase(),   phone.trim().toUpperCase() , scan.trim().toLocaleLowerCase()  , parseInt(enfants) ,  embauche instanceof Date ? embauche : new Date(embauche) , contrat.trim().toLocaleLowerCase() ,  assurance.trim().toLocaleLowerCase() , service.trim().toLocaleLowerCase() , parseInt(salaire)  , observations.trim() , (err, res) => {
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
    onDelete(e){

        e.preventDefault();
        if ( this.props.employe._id ) {

            const suppression = confirm(`Voulez vous supprimer le employe du bus: ${this.props.employe.phone}, scanination: ${this.props.employe.scan}, date: ${moment(this.props.employe.cni).format('lll')} ?`);

            if (suppression) {

                Meteor.call('employes.delete', this.props.employe._id , (err, res) => {
                    if (!err) {

                        Bert.alert( 'element supprime avec succes.', 'danger', 'growl-top-right', 'fa-check'  )

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
            employeId: !!this.props.employe._id ,
            nom: !!this.props.employe.nom ,
            birtday : this.props.employe._id,
            cni: this.props.employe.cni,
            phone: this.props.employe.phone,
            scan: this.props.employe.scan ,
            enfants: this.props.employe.enfants,
            embauche: this.props.employe.embauche ,
            contrat: this.props.employe.contrat,
            assurance: this.props.employe.assurance,
            service: this.props.employe.services,
            salaire: this.props.employe.salaire,
            km: this.props.employe.km,
            observations: this.props.employe.observations,
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
                                                this.setState( { birthday : startDate[0] } ) ;
                                                console.log(this.state.birthday) ;
                                            } }
                                            options={
                                                {
                                                    defaultDate: new Date(this.state.birthday),
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
                                                    defaultDate: new Date(this.state.embauche),
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
                                           name='observationservations'
                                           value={this.state.observations}
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
                <Table.Cell> -- </Table.Cell>
                <Table.Cell>{this.props.employe.nom}</Table.Cell>
                <Table.Cell>{moment().diff(moment(this.props.employe.bday),'years')}</Table.Cell>
                <Table.Cell>{this.props.employe.salaire}</Table.Cell>
                <Table.Cell>{moment(this.props.employe.embauche).format('lll')}</Table.Cell>
                <Table.Cell>{this.props.employe.contrat}</Table.Cell>
                <Table.Cell>{this.props.employe.assurance}</Table.Cell>
                <Table.Cell>{this.props.employe.service}</Table.Cell>

            </Table.Row>
        );
    }


};

EmployesListItem.propTypes = {
    employe: PropTypes.object.isRequired,
    Session: PropTypes.object.isRequired
};

export default createContainer(() => {

    const user = Meteor.user() || null;
    return {
        Session,
        user,
        call: Meteor.call,
    };
}, EmployesListItem);
