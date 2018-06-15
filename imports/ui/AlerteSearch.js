import React, { Component } from 'react'
import Flatpickr from 'react-flatpickr'
import { Session } from 'meteor/session';
import { Form, Input} from 'semantic-ui-react'
import { createContainer } from 'meteor/react-meteor-data';
import {fr} from 'flatpickr/dist/l10n/fr.js'


export class AlerteSearch extends Component {
    constructor(props) {
        super(props);
        this.state = {
            searchType: '',
            searchCode: '',
            searchImmatriculation : '',
            alerteStartedDate: '',
            alerteEndedDate: ''
        };

    }
    componentDidMount() {

            Session.set('searchType',''),
            Session.set('searchCode',''),
            Session.set('searchImmatriculation',''),
            Session.set('alerteStartedDate',''),
            Session.set('alerteEndedDate','')

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
                        name='searchType'
                        value={this.state.searchType}
                        control={Input}
                        onChange={this.handleChange.bind(this)}
                        placeholder='Type...' />
                    <Form.Field
                        name='searchCode'
                        value={this.state.searchCode}
                        control={Input}
                        onChange={this.handleChange.bind(this)}
                        placeholder='Code...' />
                    <Form.Field
                        name='searchImmatriculation'
                        value={this.state.searchImmatriculation}
                        control={Input}
                        onChange={this.handleChange.bind(this)}
                        placeholder='Immatriculations ...' />
                </Form.Group>

                <Form.Group widths='equal'>
                    <div className='field'>
                        <div className='ui input'>
                            <Flatpickr
                                as={Form.Field}
                                placeholder="Date debut achat..."
                                data-enable-time
                                onChange={ (startDate)  => {
                                    this.setState( { alerteStartedDate : startDate[0] } ) ;
                                    this.props.Session.set('alerteStartedDate', startDate[0].getTime() );
                                    console.log( this.props.Session.get('alerteStartedDate') );
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
                                placeholder="Date fin achat..."
                                data-enable-time
                                onChange={ (startDate)  => {
                                    this.setState( { alerteEndedDate : startDate[0] } ) ;
                                    this.props.Session.set('alerteEndedDate', startDate[0].getTime() );
                                    console.log( this.props.Session.get('alerteEndedDate') );
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

AlerteSearch.propTypes = {
};

export default createContainer(() => {

    return {
        Session
    };

}, AlerteSearch);