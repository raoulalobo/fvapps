import React from 'react';
import moment from 'moment';
import PropTypes from 'prop-types';
import { Session } from 'meteor/session';
import { Grid, List , Button  , Popup , Divider } from 'semantic-ui-react';
import { createContainer } from 'meteor/react-meteor-data';

export const ColisLisItem = (props) => {

    return (
        <List.Item>
            <List.Content floated='right'>
                <Grid columns='equal'>
                    <Grid.Row>
                        <Grid.Column only='mobile'>
                            <Popup
                                position='left center'
                                content={
                                    <div>
                                        {props.col.code}
                                        <Divider fitted />
                                        {moment(props.col.DateTimeExp).format('L')}
                                        <Divider fitted />
                                        {props.col.nameDest}
                                        <Divider fitted />
                                        {props.col.telDest}
                                    </div> }
                                trigger={<Button size='mini' icon='add' />}
                                on='click' />

                        </Grid.Column>

                        <Grid.Column only='tablet computer'>
                            <Popup
                                position='left center'
                                content={
                                    <div>
                                        {props.col.code}
                                        <Divider fitted />
                                        {moment(props.col.DateTimeExp).format('L')}
                                        <Divider fitted />
                                        {props.col.nameDest}
                                        <Divider fitted />
                                        {props.col.telDest.slice(-9)}
                                    </div> }
                                trigger={<Button size='mini' icon='add' />}
                                on='click' />

                            { !props.col.DateTimeArr ? <Button
                                basic size='mini'
                                onClick={ () => {
                                    const changeState = confirm('Vous confirmez que le colis '+props.col.code+' est arrive a '+props.col.dest+'?');
                                    if (changeState) {
                                        props.call('colis.arrived', props.col._id, props.col.code, props.col.dest, props.col.nameDest, props.col.telDest , (err , res)=>{
                                            if (!err) {
                                                Bert.alert( 'Mise a jour effectuee.', 'danger', 'growl-top-right', 'fa-check'  )
                                            }
                                        } );
                                    }
                                } }>Arr.</Button> : undefined }

                            { ( !props.col.DateTimeArr || props.col.DateTimeEnd ) ? undefined : <Button
                                basic size='mini'
                                onClick={ () => {
                                    const changeState = confirm('Vous confirmez que le colis '+props.col.code+' sera retire par le proprietaire du numero '+props.col.telDest.slice(-9)+' ?');
                                    if (changeState) {
                                        props.call('colis.end', props.col._id , (err , res )=> {
                                            if (!err) {
                                                Bert.alert( 'Retrait effectue.', 'danger', 'growl-top-right', 'fa-check'  )
                                            }
                                        } );
                                    }
                                } }>Ret.</Button> }

                        </Grid.Column>

                    </Grid.Row>
                </Grid>
            </List.Content>
            {/*<Image avatar src='/assets/images/avatar/small/lena.png' />*/}
            <List.Content>
                <List.Header>{props.col.code}</List.Header>
                Exp. {moment(props.col.DateTimeExp).format('L')}
            </List.Content>
        </List.Item>
    );
};

ColisLisItem.propTypes = {
    col: PropTypes.object.isRequired,
    Session: PropTypes.object.isRequired
};

export default createContainer(() => {
    return {
        Session,
        call: Meteor.call,
    };
}, ColisLisItem);
