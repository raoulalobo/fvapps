import React, { Component }  from 'react';
import { Grid , Header, Icon  } from 'semantic-ui-react'

import MainMenu from './MainMenu';
import AlertesList from './AlertesList';
import AlertesAdd from './AlertesAdd';
import AlerteSearch from './AlerteSearch';


export default class Alertes extends React.Component{
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
                            <Icon circular name='warning' />
                            <Header.Content>
                                Gestion des alertes
                                <Header.Subheader>
                                    gerer les operation relatives aux alertes
                                </Header.Subheader>
                            </Header.Content>
                        </Header>
                    </Grid.Row>

                    <Grid.Row>

                        <Grid.Column width={16}>
                            <Grid.Row>
                                <AlertesAdd/>
                            </Grid.Row>

                            <h2></h2>

                            <AlerteSearch/>

                            <Grid.Row>
                            </Grid.Row>

                            <Grid.Row>
                                <h2></h2>
                                <div className="tableOverflow">
                                    <AlertesList/>
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
