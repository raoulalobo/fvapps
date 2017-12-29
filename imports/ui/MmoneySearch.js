import React, { Component } from 'react'
import Flatpickr from 'react-flatpickr'
import { Session } from 'meteor/session';
import { Form, Input} from 'semantic-ui-react'
import { createContainer } from 'meteor/react-meteor-data';
import {fr} from 'flatpickr/dist/l10n/fr.js'


export class MmoneySearch extends Component {
    constructor(props) {
        super(props);
        this.state = {
            searchTicket: '',
            searchNom : '',
            mmoneyStartedDate: '',
            mmoneyEndedDate: ''
        };

    }
    componentDidMount() {

            Session.set('searchTicket',''),
            Session.set('searchNom',''),
            Session.set('mmoneyStartedDate',''),
            Session.set('mmoneyEndedDate','')

    }
    handleChange(e, { name,value }) {
        this.props.Session.set(name, value );
        this.setState( { [name] : this.props.Session.get(name) });
        console.log( this.props.Session.get(name) )
    }
    render() {

        return (
            <Form>

                <Form.Group widths='equal'>
                    <Form.Field
                        name='searchTicket'
                        value={this.state.searchTicket}
                        control={Input}
                        onChange={this.handleChange.bind(this)}
                        placeholder='# Ticket...' />
                    <Form.Field
                        name='searchNom'
                        value={this.state.searchNom}
                        control={Input}
                        onChange={this.handleChange.bind(this)}
                        placeholder='Noms et prenoms...' />
                </Form.Group>

                <Form.Group widths='equal'>
                    <div className='field'>
                        <div className='ui input'>
                            <Flatpickr
                                as={Form.Field}
                                placeholder="Date debut..."
                                data-enable-time
                                onChange={ (startDate)  => {
                                    this.setState( { mmoneyStartedDate : startDate[0] } ) ;
                                    this.props.Session.set('mmoneyStartedDate', startDate[0].getTime() );
                                    console.log( this.props.Session.get('mmoneyStartedDate') );
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

                    <div className='field'>
                        <div className='ui input'>
                            <Flatpickr
                                as={Form.Field}
                                placeholder="Date fin..."
                                data-enable-time
                                onChange={ (startDate)  => {
                                    this.setState( { mmoneyEndedDate : startDate[0] } ) ;
                                    this.props.Session.set('mmoneyEndedDate', startDate[0].getTime() );
                                    console.log( this.props.Session.get('mmoneyEndedDate') );
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
                </Form.Group>

            </Form>
        )
    }
}

MmoneySearch.propTypes = {
};

export default createContainer(() => {

    return {
        Session
    };

}, MmoneySearch);