import React , { Component } from 'react';
import moment from 'moment';
import PropTypes from 'prop-types';
import { Session } from 'meteor/session';
import {Form, Table , Button, Icon , Modal , Message } from 'semantic-ui-react';
import { createContainer } from 'meteor/react-meteor-data';
import {Meteor} from "meteor/meteor";
import Flatpickr from 'react-flatpickr';
import {fr} from "flatpickr/dist/l10n/fr";

export class VidangesListItem extends Component {

    constructor (props) {
        super(props);
        this.state = {
            currentUser : Meteor.user(),
            modalOpen: false,
            error: ''
        }
    }
    componentWillReceiveProps(nextProps) {
        const { user } = nextProps;
        if (user) {
            this.setState({currentUser: user._id});
        }
    }
    deleteButton () {
        if ( Roles.userIsInRole(this.state.currentUser, 'admin' ) ) {
            return (
                <Button onClick={this.onDelete.bind(this)} color='red' size='mini' icon>
                    <Icon name='trash'/>
                </Button>
            )
        }
    }
    onDelete(e){

        e.preventDefault();
        if ( this.props.vidange._id ) {

            const suppression = confirm(`Voulez vous supprimer le paiement Mobile Money #: ${this.props.vidange.ticket} ?`);
            if (suppression) {
                Meteor.call('vidanges.delete', this.props.vidange._id , (err, res) => {
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
    handleClose(){
        this.setState({
            modalOpen: false,
            error: ''
        });
    }
    handleOpen(){
        this.setState( {
            modalOpen: true,
            vidangeId : this.props.vidange._id,
            ordre : this.props.vidange.ordre,
            immatriculation: this.props.vidange.immatriculation,
            dateTime: this.props.vidange.dateTime,
            type: this.props.vidange.type ,
            nbrVoyageSimple: this.props.vidange.nbrVoyageSimple ,
            kilometrage: this.props.vidange.kilometrage ,
            observations: this.props.vidange.observations ,
            error: ''
        } );
    }
    modifyButton () {
        if ( Roles.userIsInRole(this.state.currentUser, ['admin','caisse']) ) {
            return (
                <Modal
                    onSubmit={this.onSubmit.bind(this)}
                    open={this.state.modalOpen}
                    onClose={this.handleClose.bind(this)}
                    size='small'
                    trigger={<Button onClick={this.handleOpen.bind(this)} primary size='mini' icon><Icon name='write' /></Button>}>
                    <Modal.Header>Modifier historique </Modal.Header>
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
                                    <label>Date vidange</label>
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

                                <Form.Input label='Ordre'
                                            name='ordre'
                                            value={this.state.ordre}
                                            onChange={this.onChangeField.bind(this)}/>

                            </Form.Group>

                            <Form.Group widths='equal'>

                                <Form.Input label='Immatriculation'
                                            name='immatriculation'
                                            value={this.state.immatriculation}
                                            onChange={this.onChangeField.bind(this)}/>

                                <Form.Input label='Type de vidange'
                                            name='type'
                                            value={this.state.type}
                                            onChange={this.onChangeField.bind(this)}/>


                            </Form.Group>


                            <Form.Group widths='equal'>

                                <Form.Input label='Nbr de voyages'
                                            name='nbrVoyageSimple'
                                            value={this.state.nbrVoyageSimple}
                                            onChange={this.onChangeField.bind(this)}/>

                                <Form.Input label='Kilometrage'
                                            name='kilometrage'
                                            value={this.state.kilometrage}
                                            onChange={this.onChangeField.bind(this)}/>

                            </Form.Group>

                            <Form.TextArea label='Historique ( # , Date heure, Type , Ordre , Kmtrage, Observations )'
                                           name='observations'
                                           value={this.state.observations}
                                           onChange={this.onChangeField.bind(this)}/>
                            <Form.Button fluid basic color='blue'>Modifier historique</Form.Button>

                        </Form>
                        
                    </Modal.Content>
                </Modal>
            )
        }
    }
    onChangeField(e, { name,value }) {
        this.setState( { [name] : value });
        console.log(`${name} -> ${value}`)
    }
    onSubmit(e){
        const {  vidangeId , ordre , immatriculation, dateTime , type , nbrVoyageSimple, kilometrage , observations  } = this.state;

        e.preventDefault();

        if ( ordre && immatriculation && dateTime && type  && nbrVoyageSimple  && kilometrage &&   observations ) {

            Meteor.call('vidanges.modify', vidangeId , ordre , immatriculation, dateTime instanceof Date ? dateTime : new Date(dateTime) , type , parseInt(nbrVoyageSimple), parseInt(kilometrage) , observations.trim().toLowerCase()  , (err, res) => {
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
    render () {
        return (
            <Table.Row error={ parseInt(this.props.vidange.nbrVoyageSimple) -  parseInt(this.props.vidange.dep)  < parseInt(15)  ? true : false }>
                <Table.Cell>{this.modifyButton()} {this.deleteButton()}</Table.Cell>
                <Table.Cell>{this.props.vidange.immatriculation}</Table.Cell>
                <Table.Cell>{this.props.vidange.ordre}</Table.Cell>
                <Table.Cell>{moment(this.props.vidange.dateTime).format('lll')}</Table.Cell>
                <Table.Cell>{this.props.vidange.type}</Table.Cell>
                <Table.Cell>{this.props.vidange.dep} / {this.props.vidange.nbrVoyageSimple} / {parseInt(this.props.vidange.nbrVoyageSimple) -  parseInt(this.props.vidange.dep)}</Table.Cell>
                <Table.Cell>{this.props.vidange.kilometrage}</Table.Cell>
                <Table.Cell>{this.props.vidange.observations}</Table.Cell>
            </Table.Row>
        );
    }


};

VidangesListItem.propTypes = {
    vidange: PropTypes.object.isRequired,
    Session: PropTypes.object.isRequired
};

export default createContainer(() => {

    const user = Meteor.user() || null;
    return {
        Session,
        user,
        call: Meteor.call,
    };
}, VidangesListItem );
