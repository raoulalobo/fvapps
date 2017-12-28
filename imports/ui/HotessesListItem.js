import React , { Component } from 'react';
import moment from 'moment';
import PropTypes from 'prop-types';
import { Session } from 'meteor/session';
import {Form, Table, Modal} from 'semantic-ui-react';
import { createContainer } from 'meteor/react-meteor-data';
import {Meteor} from "meteor/meteor";
import {fr} from "flatpickr/dist/l10n/fr";

export class HotessesListItem extends Component {

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
    modifyButton () {

        if ( true ) {

            return (
                <Modal
                    closeIcon
                    closeOnRootNodeClick={false}
                    onSubmit={this.onSubmit.bind(this)}
                    open={this.state.modalOpen}
                    onClose={this.handleClose.bind(this)}
                    dimmer='blurring'
                    size='small'
                    trigger={<Button onClick={this.handleOpen.bind(this)} primary size='mini' icon><Icon name='write' /></Button>}>
                    <Modal.Header>Ajouter 01 hotesse</Modal.Header>
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
                                    <label>Date Naissance</label>
                                    <div className='ui input'>
                                        <Flatpickr
                                            as={Form.Field}
                                            data-enable-time
                                            onChange={ (startDate)  => {
                                                this.setState( { dateNaissance : startDate[0] } ) ;
                                                console.log(this.state.dateNaissance) ;
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
                                <Form.Input label='Nom et Prenom'
                                            name='nom'
                                            value={this.state.nom}
                                            onChange={this.onChangeField.bind(this)}/>

                            </Form.Group>

                            <Form.Group widths='equal'>

                                <Form.Input label='CNI'
                                            name='cni'
                                            value={this.state.cni}
                                            onChange={this.onChangeField.bind(this)}/>
                                <Form.Input label='Permis de conduire'
                                            name='permis'
                                            value={this.state.permis}
                                            onChange={this.onChangeField.bind(this)}/>
                            </Form.Group>

                            <Form.Group widths='equal'>

                                <Form.Input label='Telephone #1'
                                            name='phone1'
                                            value={this.state.phone1}
                                            onChange={this.onChangeField.bind(this)}/>
                                <Form.Input label='Telephone #2'
                                            name='phone2'
                                            value={this.state.phone2}
                                            onChange={this.onChangeField.bind(this)}/>
                            </Form.Group>

                            <Form.TextArea label='Observations'
                                           name='observations'
                                           value={this.state.observations}
                                           onChange={this.onChangeField.bind(this)}/>
                            <Form.Button fluid basic color='blue'>Ajouter et creer 01 hotesse</Form.Button>

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
    render () {
        return (
            <Table.Row>
                <Table.Cell>{this.modifyButton()}</Table.Cell>
                <Table.Cell>{moment().diff(moment(this.props.hotesse.dateTime),'years')}</Table.Cell>
                <Table.Cell>{this.props.hotesse.nom}</Table.Cell>
                <Table.Cell>{this.props.hotesse.cni }</Table.Cell>
                <Table.Cell>{this.props.hotesse.phone1}</Table.Cell>
                <Table.Cell>{this.props.hotesse.phone2}</Table.Cell>
                <Table.Cell>{this.props.hotesse.obs}</Table.Cell>
            </Table.Row>
        );
    }


};

HotessesListItem.propTypes = {
    hotesse: PropTypes.object.isRequired,
    Session: PropTypes.object.isRequired
};

export default createContainer(() => {

    const user = Meteor.user() || null;
    return {
        Session,
        user,
        call: Meteor.call,
    };
}, HotessesListItem );
