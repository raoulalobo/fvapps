import React from 'react';
import { Meteor } from 'meteor/meteor';
import PropTypes from 'prop-types';
import { Session } from 'meteor/session';
import { createContainer } from 'meteor/react-meteor-data';
import { Button } from 'semantic-ui-react'
const jsonexport = require('jsonexport');
const fileDownload = require('react-file-download');
import { filtrage, sommes } from '../api/fonctions';



export class DepartsExportData extends React.Component{
    constructor (props) {
        super(props);
        this.state = {
            departs : this.props.Session.get('departs') // Hum , ceci est a revoir.
        }
    }
    componentWillReceiveProps(nextProps) {
        this.setState( { departs: nextProps.getDeparts } );
        //console.log(nextProps)

    }
    render(){
        return (
            <Button
                size='mini'
                onClick={()=>{
                    let data = this.state.departs ;
                    if (!!data){
                        let csv = Papa.unparse(data);
                        let blob = new Blob([csv],  {type: "text/csv;charset=utf-8"});
                        fileDownload(blob, 'filename.csv');
                    } else {
                        Bert.alert( 'erreur inatendue reessayez.', 'danger', 'growl-top-right', 'fa-close'  )
                    }

                } } >
                <Button.Content >
                    Export CSV
                </Button.Content>
            </Button>
        );
    }
};

DepartsExportData.propTypes = {
    getDeparts: PropTypes.array
};

export default createContainer(() => {

    const getDeparts = Session.get('departsFiltered');

    return {
        Session,
        getDeparts,
    };
}, DepartsExportData);