import React from 'react';
import { createContainer } from 'meteor/react-meteor-data';
import { Grid , Header, Icon } from 'semantic-ui-react'

import MainMenu from "./MainMenu";
import UsrsList from "./UsrsList";
import UsrAdd from "./UsrAdd";


export class Usrs extends React.Component{
    constructor (props) {
        super(props);
        this.state = {
            currentUser : Meteor.user()
        }
    }
    componentWillReceiveProps(nextProps) {
        const { user } = nextProps;
        if (user) {
            this.setState({currentUser: user._id});
        }
    }
    adminLevel() {
        if ( Roles.userIsInRole(this.state.currentUser, 'admin') ) {
            return (
                <div>

                    <MainMenu/>
                    <div className='mgnTopMainGrid'>

                    </div>
                    <Grid container divided>
                        <Grid.Row>
                            <Header as='h2'>
                                <Icon circular name='users' />
                                <Header.Content>
                                    Gestion Users
                                    <Header.Subheader>
                                        gerer les utilisateurs
                                    </Header.Subheader>
                                </Header.Content>
                            </Header>
                        </Grid.Row>

                        <Grid.Row>

                            <Grid.Column width={3} only='tablet computer'>
                                <UsrAdd/>
                            </Grid.Column>

                            <Grid.Column width={13}>
                                <Grid.Row>
                                    <h2>*SearchBar if needed</h2>
                                </Grid.Row>
                                <Grid.Row >
                                    <h2></h2>
                                    <UsrsList/>
                                </Grid.Row>
                            </Grid.Column>

                        </Grid.Row>

                    </Grid>
                    <div className='mgnBotMainGrid'>

                    </div>
                </div>
            )
        } else {
            return (
                <div>

                    <MainMenu/>
                    <div className='mgnTopMainGrid'>

                    </div>
                    <Grid container divided>
                        <Grid.Row>
                            <Header as='h2'>
                                <Icon circular name='hourglass three' />
                                <Header.Content>
                                    Verification du compte, ceci peut prendre quelques secondes ... Ou alors vous jouez au malin
                                    <Header.Subheader>
                                        contacter le service informatique -dsi@finexsvoyages.net- si apres 300 secondes  vous avez pas acces aux donnees .
                                    </Header.Subheader>
                                </Header.Content>
                            </Header>
                        </Grid.Row>

                    </Grid>
                    <div className='mgnBotMainGrid'>

                    </div>
                </div>
            )
        }
    }
    render() {
        return (
            <div>
                {this.adminLevel()}
            </div>
        );
    }

};


export default createContainer(() => {
    const user = Meteor.user() || null;
    return {
        user
    };
}, Usrs);