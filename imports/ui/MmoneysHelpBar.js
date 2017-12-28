import React from 'react';
import { Meteor } from 'meteor/meteor';
import PropTypes from 'prop-types';
import { Session } from 'meteor/session';
import { createContainer } from 'meteor/react-meteor-data';
import { Button } from 'semantic-ui-react'
import { filtrage, sommes } from '../api/fonctions';



export class MmoneysHelpBar extends React.Component{
    constructor (props) {
        super(props);
        this.state = {
            mmoneys : this.props.Session.get('mmoneys') // Hum , ceci est a revoir.
        }
    }
    componentWillReceiveProps(nextProps) {
        this.setState( { mmoneys: nextProps.getMmoneys } );
        //console.log(nextProps)

    }
    render(){
        return (
            <Button
                fluid
                animated='fade'
                color='green'>
                <Button.Content visible>
                    {this.state.mmoneys ? this.state.mmoneys.length : '0'} elts
                </Button.Content>
                <Button.Content hidden>
                    -----
                </Button.Content>
            </Button>
        );
    }
};

MmoneysHelpBar.propTypes = {
    getMmoneys: PropTypes.array
};

export default createContainer(() => {

    const getMmoneys = Session.get('mmoneysFiltered');

    return {
        Session,
        getMmoneys,
    };
}, MmoneysHelpBar);
