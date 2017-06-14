import React from 'react';
import { Tracker } from 'meteor/tracker';
import { Meteor } from 'meteor/meteor';
import { Session } from 'meteor/session';
import { Button } from 'semantic-ui-react'
import { createContainer } from 'meteor/react-meteor-data';
const _ = require('lodash');


export class ColisFilter extends React.Component{
    constructor (props) {
        super(props);
        this.state = {
            activeItem : '',
            colis : this.props.Session.get('colis') // Hum , ceci est a revoir.
        }
    }
    componentWillReceiveProps(nextProps){
        this.setState( { colis: nextProps.getColis } );
        this.setState( { activeItem: nextProps.activeItem } );
        //console.log(nextProps);
    }
    handleItemClick(e, { name }) {
        this.setState( { activeItem: name } );
        Session.set('state',name);
        //console.log(this.state.activeItem);
    }
    render() {
        const { activeItem } = this.state;
        return (
            <div>
                <div className="mrgnButton">
                    <Button
                        name='A'
                        onClick={this.handleItemClick.bind(this)}
                        fluid
                        active={activeItem === 'A'}
                        basic>
                        Colis envoyes ({_.filter(this.state.colis, { 'state': 'A'}).length})
                    </Button>
                </div>
                <div className="mrgnButton">
                    <Button
                        name='B'
                        onClick={this.handleItemClick.bind(this)}
                        fluid
                        active={activeItem === 'B'}
                        basic>
                        Colis a retirer ({_.filter(this.state.colis, { 'state': 'B'}).length})
                    </Button>
                </div>
                <div className="mrgnButton">
                    <Button
                        name='C'
                        onClick={this.handleItemClick.bind(this)}
                        fluid
                        active={activeItem === 'C'}
                        basic>
                        Colis retires ({_.filter(this.state.colis, { 'state': 'C'}).length})
                    </Button>
                </div>

            </div>
        );
    }
};

ColisFilter.propTypes = {
};

export default createContainer(() => {
    const activeItem = Session.get('state');
    const getColis = Session.get('colis');
    return {
        Session,
        getColis,
        activeItem
    };
}, ColisFilter);