const R = require('ramda');

import React from 'react';
import PropTypes from 'prop-types';
import { Session } from 'meteor/session';
import { createContainer } from 'meteor/react-meteor-data';
import { Button, Icon } from 'semantic-ui-react'

export class DepensesHelpBar extends React.Component{
    constructor (props) {
        super(props);
        this.state = {
            depenses : this.props.Session.get('depenses') // Hum , ceci est a revoir.
        }
    }
    componentWillReceiveProps(nextProps) {
        this.setState( { depenses: nextProps.getDepenses } );
        console.log(nextProps)
    }
    render(){
        const  summ = (sum,n)=> sum + n.total
        return (
            <Button
                fluid
                animated
                color='green'>
                <Button.Content visible>
                    {this.state.depenses ? this.state.depenses.length : '0'} elts ->
                    Total : {R.reduce(summ, 0,this.state.depenses ? this.state.depenses : [])} Fcfa
                </Button.Content>
                <Button.Content hidden>
                    <Icon name='file excel outline' />
                </Button.Content>
            </Button>
        );
    }
};

DepensesHelpBar.propTypes = {
    getDepenses: PropTypes.array
};

export default createContainer(() => {

    const getDepenses = Session.get('depensesFiltered');

    return {
        Session,
        getDepenses,
    };
}, DepensesHelpBar);
