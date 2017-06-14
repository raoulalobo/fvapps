import React from 'react';
import 'moment/locale/fr';
import moment from 'moment';
import PropTypes from 'prop-types';
import { Session } from 'meteor/session';
import { createContainer } from 'meteor/react-meteor-data';
import { Grid, List , Button , Icon } from 'semantic-ui-react';

export const ResaListItem = (props) => {

    return (
        <List.Item>
            <List.Content floated='right'>
                <Grid columns='equal'>
                    <Grid.Row>
                        <Grid.Column>
                            {props.res.visible ?  <Button basic size='mini' color='blue'><Icon name='checkmark' /></Button>: <Button
                                color='red'
                                basic
                                size='mini'
                                onClick={ () => {
                                    const changeState = confirm('Vous confirmez que la reservation du client '+props.res.name+' ?');
                                    if (changeState) {
                                        props.call('resas.confirmation', props.res._id , true ,(err , res )=> {
                                            if (!err) {
                                                Bert.alert( 'Confirmation effectuee.', 'danger', 'growl-top-right', 'fa-check'  )
                                            }
                                        } );
                                    }
                                } }><Icon name='question' /></Button>}
                        </Grid.Column>
                    </Grid.Row>
                </Grid>
            </List.Content>
            <List.Content>
                <List.Header></List.Header>
                {props.res.name} - {props.res.phone }<br/>
                {moment(props.res.resa).locale("fr").format('lll')}
            </List.Content>
        </List.Item>
    );
};

ResaListItem.propTypes = {
    res: PropTypes.object,
    Session: PropTypes.object
};

export default createContainer(() => {
    return {
        Session,
        call: Meteor.call,
    };
}, ResaListItem);
