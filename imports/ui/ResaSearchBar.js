import React, { Component } from 'react'
import { Session } from 'meteor/session';
import { Form, Input} from 'semantic-ui-react'
import { createContainer } from 'meteor/react-meteor-data';


export class ResaSearchBar extends Component {
    constructor(props) {
        super(props);
        this.state = {
            phone: '',
            cni : ''
        };

    }
    componentDidMount() {

        Session.set('phone',''),
        Session.set('cni','')
    }
    render() {

        return (
            <Form>
                <Form.Group widths='equal'>
                    <Form.Field
                        value={this.state.phone}
                        control={Input}
                        onChange={ (e)=> {
                            this.props.Session.set('phone', e.target.value );
                            this.setState( { phone : this.props.Session.get('phone') });
                            console.log( this.props.Session.get('phone') )
                        } }
                        placeholder='Telephone...' />
                    <Form.Field
                        value={this.state.cni}
                        control={Input}
                        onChange={ (e)=> {
                            this.props.Session.set('cni', e.target.value );
                            this.setState( { cni : this.props.Session.get('cni') });
                            console.log( this.props.Session.get('cni') )
                        } }
                        placeholder='CNI...'
                        disabled
                    />
                </Form.Group>
            </Form>
        )
    }
}

ResaSearchBar.propTypes = {
};

export default createContainer(() => {

    return {
        Session
    };

}, ResaSearchBar );