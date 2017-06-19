import React, { Component } from 'react'
import Flatpickr from 'react-flatpickr'
import { Session } from 'meteor/session';
import { Form, Input} from 'semantic-ui-react'
import { createContainer } from 'meteor/react-meteor-data';
import {fr} from 'flatpickr/dist/l10n/fr.js'


export class ColisSearchBar extends Component {
    constructor(props) {
        super(props);
        this.state = {
            searchColis: '',
            searchVille : '',
            StartedDate: '',
            EndedDate: ''
        };

    }
    componentDidMount() {


        Session.set('StartedDate',''),
        Session.set('EndedDate',''),
        Session.set('searchColis',''),
        Session.set('searchVille','')
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
                                    this.setState( { StartedDate : startDate[0] } ) ;
                                    this.props.Session.set('StartedDate', startDate[0] );
                                    //console.log( this.props.Session.get('StartedDate') );
                                } }
                                options={
                                    {
                                        altInput: true,
                                        time_24hr: true,
                                        locale : fr
                                        //minDate: "today",
                                        //maxDate: new Date().fp_incr(7),
                                        //defaultDate : new Date()
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
                                    this.setState( { EndedDate : startDate[0] } ) ;
                                    this.props.Session.set('EndedDate', startDate[0] );
                                    console.log( this.props.Session.get('EndedDate') );
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
                        name='searchColis'
                        value={this.state.searchColis}
                        control={Input}
                        onChange={this.handleChange.bind(this)}
                        placeholder='Colis ID...' />
                    <Form.Field
                        name='searchVille'
                        value={this.state.searchVille}
                        control={Input}
                        onChange={this.handleChange.bind(this)}
                        placeholder='Destination...' />
                    {/*
                    Ancienne methode - Marche a 100%
                    <Form.Field
                        value={this.state.searchVille}
                        control={Input}
                        onChange={ (e)=> {
                            this.props.Session.set('searchVille', e.target.value );
                            this.setState( { searchVille : this.props.Session.get('searchVille') });
                            console.log( this.props.Session.get('searchVille') )
                        } }
                        placeholder='Destination...' />
                    */}
                </Form.Group>
            </Form>
        )
    }
}

ColisSearchBar.propTypes = {
};

export default createContainer(() => {

    return {
        Session
    };

}, ColisSearchBar);