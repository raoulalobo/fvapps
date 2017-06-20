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
    fitre(v){
        return _.filter(this.state.colis, { 'state': v }).length
    }
    render() {
        const { activeItem } = this.state;
        return (
            <div>
                <div className="mrgnButton">
                    <Button
                        name='A'
                        content={this.fitre('A')+' Colis envoyes'}
                        onClick={this.handleItemClick.bind(this)}
                        fluid
                        active={activeItem === 'A'}
                        basic/>
                </div>
                <div className="mrgnButton">
                    <Button
                        name='B'
                        content={this.fitre('B')+' Colis a retirer'}
                        onClick={this.handleItemClick.bind(this)}
                        fluid
                        active={activeItem === 'B'}
                        basic/>
                </div>
                <div className="mrgnButton">
                    <Button
                        name='C'
                        content={this.fitre('C')+' Colis retires'}
                        onClick={this.handleItemClick.bind(this)}
                        fluid
                        active={activeItem === 'C'}
                        basic/>
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