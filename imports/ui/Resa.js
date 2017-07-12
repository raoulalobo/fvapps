import React from 'react';
import { Grid , Header, Icon } from 'semantic-ui-react'

import ResaAdd from './ResaAdd';
import ResaList from './ResaList';
import MainMenu from './MainMenu';
import ResaSearchBar from './ResaSearchBar';





export default () => {
    return (
        <div>
            <MainMenu/>
            <div className='mgnTopMainGrid'>

            </div>
            <Grid container divided>
                <Grid.Row>
                    <Header as='h2'>
                        <Icon circular name='calendar' />
                        <Header.Content>
                            Gestion Resa
                            <Header.Subheader>
                                gerer les reservations
                            </Header.Subheader>
                        </Header.Content>
                    </Header>
                </Grid.Row>

                <Grid.Row>

                    <Grid.Column width={3} only='tablet computer'>
                        <ResaAdd/>
                        <h2>Filtre resa</h2>
                    </Grid.Column>

                    <Grid.Column width={13}>
                        <Grid.Row>
                            <ResaSearchBar/>
                        </Grid.Row>
                        <Grid.Row>
                            <h2>Resa searchResult</h2>
                        </Grid.Row>
                        <Grid.Row>
                            <h2></h2>
                            <ResaList/>
                        </Grid.Row>
                    </Grid.Column>

                </Grid.Row>

            </Grid>
            <div className='mgnBotMainGrid'>

            </div>
        </div>
    );
};