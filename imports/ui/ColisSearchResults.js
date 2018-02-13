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
            //colis BDD
            colis : this.props.Session.get('colis') // Hum , ceci est a revoir.
        }
    }
    componentWillReceiveProps(nextProps) {
        //Utiliser colis filtres dans ColisList.js
        this.setState( { colis: nextProps.getColis } );
        console.log(nextProps)
    }
    render(){
        return (
            <Button
                fluid
                animated
                onClick={()=>{
                    var data = this.state.colis ;
                    if (!!data){
                        var csv = Papa.unparse(data);
                        var blob = new Blob([csv],  {type: "text/csv;charset=utf-8"});
                        fileDownload(blob, 'filename.csv');
                    } else {
                        Bert.alert( 'erreur inatendue reessayez.', 'danger', 'growl-top-right', 'fa-close'  )
                    }

                } }
                color='green'>
                <Button.Content visible>
                    {this.state.colis ? this.state.colis.length : '0'} elements .
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

    const getColis = Session.get('colisFiltered');

    return {
        Session,
        getColis,
    };
}, ColisSearchResults);
