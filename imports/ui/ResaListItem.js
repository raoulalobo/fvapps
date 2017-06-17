import React , { Component } from 'react';
import 'moment/locale/fr';
import moment from 'moment';
import PropTypes from 'prop-types';
import { Session } from 'meteor/session';
import { createContainer } from 'meteor/react-meteor-data';
import { Grid, List , Button , Icon } from 'semantic-ui-react';

export class ResaListItem extends Component {

    constructor (props) {
        super(props);
        this.state = {
            currentUser : Meteor.user(),
        }
    }
    componentWillReceiveProps(nextProps) {
        const { user } = nextProps;
        if (user) {
            this.setState({currentUser: user._id});
        }
    }
    adminButton () {
        if ( Roles.userIsInRole(this.state.currentUser, 'admin') ) {
            return (
                <Button
                    basic
                    color='red'
                    icon='remove'
                    size='mini'
                    onClick={ () => {
                        const changeState = confirm('Vous confirmez la suppression resa id '+this.props.res._id+' ? ');
                        if (changeState) {
                            this.props.call('resa.deleted', this.props.res._id , (err , res)=>{
                                if (!err) {
                                    Bert.alert( 'Suppression effectuee.', 'danger', 'growl-top-right', 'fa-check'  )
                                }
                            } );
                        }
                    } }
                />
            )
        }
    }
    render () {
        return (
            <List.Item>
                <List.Content floated='right'>
                    <Grid columns='equal'>
                        <Grid.Row>
                            <Grid.Column>
                                {this.adminButton()}
                                {this.props.res.visible ?  <Button basic size='mini' color='blue'><Icon name='checkmark' /></Button>: <Button
                                    color='red'
                                    basic
                                    size='mini'
                                    onClick={ () => {
                                        const changeState = confirm('Vous confirmez que la reservation du client '+this.props.res.name+' ?');
                                        if (changeState) {
                                            this.props.call('resas.confirmation', this.props.res._id ,(err , res )=> {
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
                    {this.props.res.name} - {this.props.res.phone }<br/>
                    {moment(this.props.res.resa).locale("fr").format('lll')}
                </List.Content>
            </List.Item>
        );
    }

};

ResaListItem.propTypes = {
    res: PropTypes.object,
    Session: PropTypes.object
};

export default createContainer(() => {

    const user = Meteor.user() || null;
    return {
        Session,
        user,
        call: Meteor.call,
    };
}, ResaListItem);
