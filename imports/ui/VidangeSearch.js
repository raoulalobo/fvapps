import React, { Component } from 'react'
import Flatpickr from 'react-flatpickr'
import { Session } from 'meteor/session';
import { Form, Input} from 'semantic-ui-react'
import { createContainer } from 'meteor/react-meteor-data';
import {fr} from 'flatpickr/dist/l10n/fr.js'


export class VidangeSearch extends Component {
    constructor(props) {
        super(props);
        this.state = {
            searchImmatriculation: '',
            searchOdre : '',
        };

    }
    componentDidMount() {

        Session.set('searchImmatriculation',''),
            Session.set('searchOdre','')


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
                        name='searchImmatriculation'
                        value={this.state.searchImmatriculation}
                        control={Input}
                        onChange={this.handleChange.bind(this)}
                        placeholder='Immatriculation...' />
                    <Form.Field
                        name='searchOdre'
                        value={this.state.searchOdre}
                        control={Input}
                        onChange={this.handleChange.bind(this)}
                        placeholder='Odres...' />
                </Form.Group>

            </Form>
        )
    }
}

VidangeSearch.propTypes = {
};

export default createContainer(() => {

    return {
        Session
    };

}, VidangeSearch);