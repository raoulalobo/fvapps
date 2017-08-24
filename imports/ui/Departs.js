import React, { Component }  from 'react';
import { Grid , Header, Icon  } from 'semantic-ui-react'

import MainMenu from './MainMenu';
import DepartsList from './DepartsList';
import DepartsAdd from './DepartsAdd';
import DepartSearch from './DepartSearch';
import DepartsHelpBar from './DepartsHelpBar';


export default class Departs extends React.Component{
    constructor(props) {
        super(props);
    }
    render(){
        return (
            <div>
                <MainMenu/>
                <div className='mgnTopMainGrid'>

                </div>
                <Grid container divided>
                    <Grid.Row>
                        <Header as='h2'>
                            <Icon circular name='bus' />
                            <Header.Content>
                                Gestion des departs
                                <Header.Subheader>
                                    gerer les operation relatives aux departs
                                </Header.Subheader>
                            </Header.Content>
                        </Header>
                    </Grid.Row>

                    <Grid.Row>

                        <Grid.Column width={16}>
                            <Grid.Row>
                                <DepartsAdd/>
                            </Grid.Row>

                            <h2></h2>
                            <DepartSearch/>

                            <Grid.Row>
                                <DepartsHelpBar/>
                            </Grid.Row>

                            <Grid.Row>
                                <h2></h2>
                                <div className="tableOverflow">
                                    <DepartsList/>
                                </div>
                            </Grid.Row>

                        </Grid.Column>

                    </Grid.Row>

                </Grid>
                <div className='mgnBotMainGrid'>

                </div>
            </div>
        )
    }

};
