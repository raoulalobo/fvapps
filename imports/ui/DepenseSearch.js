import React, { Component } from 'react'
import Flatpickr from 'react-flatpickr'
import { Session } from 'meteor/session';
import { Form, Input} from 'semantic-ui-react'
import { createContainer } from 'meteor/react-meteor-data';
import {fr} from 'flatpickr/dist/l10n/fr.js'


export class DepenseSearch extends Component {
    constructor(props) {
        super(props);
        this.state = {
            searchGenre: '',
            searchCode : '',
            searchDesi: '',
            depenseStartedDate: '',
            depenseEndedDate: ''
        };

    }
    componentDidMount() {

        Session.set('searchGenre',''),
        Session.set('searchCode',''),
        Session.set('searchDesi',''),
        Session.set('depenseStartedDate',''),
        Session.set('depenseEndedDate','')

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
                    <div className='field'>
                        <div className='ui input'>
                            <Flatpickr
                                as={Form.Field}
                                placeholder="Date debut..."
                                data-enable-time
                                onChange={ (startDate)  => {
                                    this.setState( { depenseStartedDate : startDate[0] } ) ;
                                    this.props.Session.set('depenseStartedDate', startDate[0].getTime() );
                                    console.log( this.props.Session.get('depenseStartedDate') );
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
                                    this.setState( { depenseEndedDate : startDate[0] } ) ;
                                    this.props.Session.set('depenseEndedDate', startDate[0].getTime() );
                                    console.log( this.props.Session.get('depenseEndedDate') );
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
                        name='searchCode'
                        value={this.state.searchCode}
                        control={Input}
                        onChange={this.handleChange.bind(this)}
                        placeholder='Code / Bus...' />
                    <Form.Field
                        name='searchGenre'
                        value={this.state.searchGenre}
                        control={Input}
                        onChange={this.handleChange.bind(this)}
                        placeholder='Type...' />
                    <Form.Field
                        name='searchDesi'
                        value={this.state.searchDesi}
                        control={Input}
                        onChange={this.handleChange.bind(this)}
                        placeholder='Designation...' />
                </Form.Group>
            </Form>
        )
    }
}

DepenseSearch.propTypes = {
};

export default createContainer(() => {

    return {
        Session
    };

}, DepenseSearch);