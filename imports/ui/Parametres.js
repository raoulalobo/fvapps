import React from 'react';
import { createContainer } from 'meteor/react-meteor-data';
import { Grid , Header, Icon , Menu , Input  } from 'semantic-ui-react'


import MainMenu from "./MainMenu";
import ComposantsAdmin from "./ComposantsAdmin";
import ComposantsList from "./ComposantsList";
import {Session} from "meteor/session";




export class Paremetres extends React.Component{
    constructor (props) {
        super(props);
        this.state = {
            currentUser : Meteor.user(),
            affichage: 'hotesses',
            upload: false,
        }
    }
    componentWillReceiveProps(nextProps,nextState) {
        /*const { user } = nextProps;
        if (user) {
            this.setState({currentUser: user._id});
        }*/
        const { affichage } = nextState;
        //console.log(`props : ${nextProps}`)
        console.log(`state : ${affichage}`)
    }
    componentWillUpdate(nextProps, nextState){
        const { affichage } = nextState;
        //console.log(`props : ${nextProps}`)
        console.log(`state : ${affichage}`)
    }
    onChangeField(e, { name }) {
        this.setState( { affichage : name });
        console.log(` affichage -> ${name}`)

    }
    onUpload(event) {
        Session.set('upload', true);
        Papa.parse( event.target.files[0], {
            header: true,
            complete( results, file ) {
                // Handle the upload here.
                Meteor.call( 'parseUpload', results.data, ( error, response ) => {
                    if ( error ) {
                        console.log( error.reason );
                    } else {
                        Session.set('upload', false );
                        Bert.alert( 'Upload complete!', 'success', 'growl-top-right' );
                    }
                });
            }
        })
    }
    adminLevel() {
        if ( Roles.userIsInRole(this.state.currentUser, 'admine') ) {
            return (
                <div>

                    <MainMenu/>
                    <div className='mgnTopMainGrid'>

                    </div>
                    <div className='ourDropdown'>

                        <Grid divided>
                            <Grid.Row>
                                <Header as='h2'>
                                    <Icon circular name='settings' />
                                    <Header.Content>
                                        Gestion des parametres
                                        <Header.Subheader>
                                            gerer les utilisateurs, polices, etc ...
                                        </Header.Subheader>
                                    </Header.Content>
                                </Header>
                            </Grid.Row>

                            <Grid.Row>

                                <Grid.Column width={3}>

                                    <Menu vertical>

                                        <Menu.Item name='hotesses' onClick={this.onChangeField.bind(this)}>
                                            Hotesses
                                        </Menu.Item>
                                    </Menu>

                                </Grid.Column>

                                <Grid.Column width={13}>
                                    <Grid.Row>
                                        <ComposantsAdmin  tag={this.state.affichage} />
                                        <Input
                                            size='mini'
                                            type='file'
                                            name='uploadCSV'
                                            onChange={this.onUpload.bind(this)}></Input>
                                        <h2> </h2>
                                    </Grid.Row>
                                    <Grid.Row>
                                        <h2>*Barres de recherche et/ou filtres...</h2>
                                    </Grid.Row>
                                    <Grid.Row >
                                        <h2> </h2>
                                        <ComposantsList tag={this.state.affichage}/>
                                    </Grid.Row>
                                </Grid.Column>

                            </Grid.Row>

                        </Grid>

                    </div>

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
}, Paremetres);
