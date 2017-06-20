import React from 'react';
import PropTypes from 'prop-types';
import { Session } from 'meteor/session';
import { createContainer } from 'meteor/react-meteor-data';
import { Grid, List , Image , Button , Segment} from 'semantic-ui-react';

export const UsrsListItem = (props) => {

    return (
    <List.Item>
        <List.Content floated='right'>
            <Grid columns='equal'>
                <Grid.Row>
                    <Grid.Column>
                        <Button basic size='mini'>-</Button>
                        <Button basic size='mini'>+</Button>
                        <Button
                            basic
                            size='mini'
                            onClick={ () => {
                                var confirmation = confirm('Role of ('+props.usr.emails[0].address+') will be modified. Confirm ?');
                                if (confirmation) {
                                    props.call('add.role', props.usr._id );
                                    console.log( props.usr._id ) ;
                                }
                            } }
                        >++</Button>
                        <Button
                            basic
                            color='red'
                            icon='remove'
                            size='mini'
                            onClick={ () => {
                                const changeState = confirm('Vous confirmez la suppression du user '+props.usr.emails[0].address.split('@')[0]+' ? ');
                                if (changeState) {
                                    props.call('delete.user', props.usr._id , (err , res)=>{
                                        if (!err) {
                                            Bert.alert( 'Suppression effectuee.', 'danger', 'growl-top-right', 'fa-check'  )
                                        }
                                    } );
                                }
                            } }
                        />
                    </Grid.Column>
                </Grid.Row>
            </Grid>
        </List.Content>
        {/*<Image avatar src='/assets/images/avatar/small/lena.png' />*/}
        <List.Content>
            <List.Header>{props.usr.emails[0].address.split('@')[0]}</List.Header>
            {!!props.usr.roles ? 'Droit: '+props.usr.roles : 'Aucun droit'}
        </List.Content>
    </List.Item>
    );
};

UsrsListItem.propTypes = {
    usr: PropTypes.object,
    Session: PropTypes.object
};

export default createContainer(() => {
    return {
        Session,
        call: Meteor.call,
    };
}, UsrsListItem);
