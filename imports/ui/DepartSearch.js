import React, { Component } from 'react'
import Flatpickr from 'react-flatpickr'
import { Session } from 'meteor/session';
import { Form, Input} from 'semantic-ui-react'
import { createContainer } from 'meteor/react-meteor-data';
import {fr} from 'flatpickr/dist/l10n/fr.js'


export class DepartSearch extends Component {
    constructor(props) {
        super(props);
        this.state = {
            searchClasse: '',
            searchVille:'',
            searchBus : '',
            departStartedDate: '',
            departEndedDate: ''
        };

    }
    componentDidMount() {

        Session.set('departStartedDate',''),
        Session.set('departEndedDate',''),
        Session.set('searchClasse',''),
        Session.set('searchVille',''),
        Session.set('searchBus','')
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
                                    this.setState( { departStartedDate : startDate[0] } ) ;
                                    this.props.Session.set('departStartedDate', startDate[0].getTime() );
                                    console.log( this.props.Session.get('departStartedDate') );
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
                                    this.setState( { departEndedDate : startDate[0] } ) ;
                                    this.props.Session.set('departEndedDate', startDate[0].getTime() );
                                    console.log( this.props.Session.get('departEndedDate') );
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
                        name='searchClasse'
                        value={this.state.searchClasse}
                        control={Input}
                        onChange={this.handleChange.bind(this)}
                        placeholder='Classe...' />
                    <Form.Field
                        name='searchVille'
                        value={this.state.searchVille}
                        control={Input}
                        onChange={this.handleChange.bind(this)}
                        placeholder='Ville arrivee...' />
                    <Form.Field
                        name='searchBus'
                        value={this.state.searchBus}
                        control={Input}
                        onChange={this.handleChange.bind(this)}
                        placeholder='Bus...' />
                </Form.Group>
            </Form>
        )
    }
}

DepartSearch.propTypes = {
};

export default createContainer(() => {

    return {
        Session
    };

}, DepartSearch);