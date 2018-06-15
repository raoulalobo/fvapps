import React, { Component } from 'react'
import Flatpickr from 'react-flatpickr'
import { Session } from 'meteor/session';
import { Form, Input} from 'semantic-ui-react'
import { createContainer } from 'meteor/react-meteor-data';
import {fr} from 'flatpickr/dist/l10n/fr.js'
import {Meteor} from "meteor/meteor";


export class EmployeSearch extends Component {
    constructor(props) {
        super(props);
        this.state = {
            searchNom: '',
            searchService:'',
            searchAssurance : '',
            searchContrat : '',
            employeStartedDate: '',
            employeEndedDate: ''
        };

    }
    componentDidMount() {

        Session.set('employeStartedDate',new Date(2015 , 11, 31).getTime()),
        Session.set('employeEndedDate',''),
        Session.set('searchNom',''),
        Session.set('searchService',''),
        Session.set('searchAssurance',''),
        Session.set('searchContrat','')
    }
    handleChange(e, { name,value }) {
        this.props.Session.set(name, value );
        this.setState( { [name] : this.props.Session.get(name) });
        console.log( `${[name]} -> ${this.props.Session.get(name)}` )
    }
    render() {

        return (
            <Form>
                <Form.Group widths='equal'>
                    <div className='field'>
                        <div className='ui input'>
                            <Flatpickr
                                as={Form.Field}
                                placeholder="Date debut..."
                                data-enable-time
                                onChange={ (startDate)  => {
                                    this.setState( { employeStartedDate : startDate[0] } ) ;
                                    this.props.Session.set('employeStartedDate', startDate[0].getTime() );
                                    console.log( this.props.Session.get('employeStartedDate') );
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
                                    this.setState( { employeEndedDate : startDate[0] } ) ;
                                    this.props.Session.set('employeEndedDate', startDate[0].getTime() );
                                    console.log( this.props.Session.get('employeEndedDate') );
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

                <Form.Group widths='equal'>

                    <Form.Field
                        name='searchNom'
                        value={this.state.searchNom}
                        control={Input}
                        onChange={this.handleChange.bind(this)}
                        placeholder='Nom et prenom...' />
                    <Form.Field
                        name='searchService'
                        value={this.state.searchService}
                        control={Input}
                        onChange={this.handleChange.bind(this)}
                        placeholder='Service...' />
                    <Form.Field
                        name='searchAssurance'
                        value={this.state.searchAssurance}
                        control={Input}
                        onChange={this.handleChange.bind(this)}
                        placeholder='Assurance...' />
                    <Form.Field
                        name='searchContrat'
                        value={this.state.searchContrat}
                        control={Input}
                        onChange={this.handleChange.bind(this)}
                        placeholder='Contrat...' />
                </Form.Group>
            </Form>
        )
    }
}

EmployeSearch.propTypes = {
};

export default createContainer(() => {

    return {
        Session
    };

}, EmployeSearch);