const _ = require('lodash');
const jsonexport = require('jsonexport');
const fileDownload = require('react-file-download');

import React from 'react';
import PropTypes from 'prop-types';
import { Session } from 'meteor/session';
import { createContainer } from 'meteor/react-meteor-data';
import { Grid , List , Image , Button, Icon } from 'semantic-ui-react'




export class ColisSearchResults extends React.Component{
    constructor (props) {
        super(props);
        this.state = {
            colis : this.props.Session.get('colis') // Hum , ceci est a revoir.
        }
    }
    componentWillReceiveProps(nextProps) {
        this.setState( { colis: nextProps.getColis } );
    }
    render(){
        const getState = this.props.getState ;
        const getId = this.props.getId ;
        const getDest = this.props.getDest ;
        const StartedDate = this.props.StartedDate ;
        const EndedDate = this.props.EndedDate ;
        return (
            <Button
                fluid
                animated
                color='green'
                onClick={ ()=>{
                    exp = jsonexport(
                        _.chain(this.state.colis)
                            .filter(function(coli) { return coli.state.match(  new RegExp( getState, 'i') ); })
                            .filter(function(coli) { return coli.code.match(  new RegExp( getId, 'i') ); })
                            .filter(function(coli) { return coli.dest.match(  new RegExp( getDest, 'i') ); })
                            .filter(function(coli) { return coli.DateTimeExp >= StartedDate.getTime(); })
                            .filter(function(coli) { return coli.DateTimeExp <= EndedDate.getTime(); })
                            .value(), function (err, csv) {
                            if (err) return console.log(err);
                            if (!err) console.log( csv );
                            //fileDownload(csv, 'filename.csv');
                        });


                }}
            >
                <Button.Content visible>
                    {(_.chain(this.state.colis)
                        .filter(function(coli) { return coli.state.match(  new RegExp( getState, 'i') ); })
                        .filter(function(coli) { return coli.code.match(  new RegExp( getId, 'i') ); })
                        .filter(function(coli) { return coli.dest.match(  new RegExp( getDest, 'i') ); })
                        .filter(function(coli) { return coli.DateTimeExp >= StartedDate.getTime(); })
                        .filter(function(coli) { return coli.DateTimeExp <= EndedDate.getTime(); })
                        .value() ).length} elements .
                    Cliquez pour exporter au format CSV
                </Button.Content>
                <Button.Content hidden>
                    <Icon name='file excel outline' />
                </Button.Content>
            </Button>
        );
    }
};

ColisSearchResults.propTypes = {
    getColis: PropTypes.array
};

export default createContainer(() => {


    const getColis = Session.get('colis');
    const activeItem = Session.get('state');
    const getState = Session.get('state') || undefined ;
    const getId = Session.get('searchColis') || undefined ;
    const getDest = Session.get('searchVille') || undefined ;
    const StartedDate = Session.get('StartedDate') || new Date('1970-01-01') ;
    const EndedDate = Session.get('EndedDate') || new Date();


    return {
        Session,
        getColis,
        getState,
        getId,
        getDest,
        EndedDate,
        activeItem,
        StartedDate
    };
}, ColisSearchResults);
