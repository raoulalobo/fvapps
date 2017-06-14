import React from 'react';
import { Grid , List , Image , Button , Header, Icon } from 'semantic-ui-react'
import MainMenu from './MainMenu';
import ColisSearchBar from './ColisSearchBar';
import ColisSearchResults from './ColisSearchResults';
import ColisList from './ColisList';
import ColisAdd from './ColisAdd';
import ColisFilter from './ColisFilter';



export default () => {
    return (
        <div>
            <MainMenu/>
            <div className='mgnTopMainGrid'>

            </div>
            <Grid container divided>
                <Grid.Row>
                    <Header as='h2'>
                        <Icon circular rotated='clockwise' name='settings' />
                        <Header.Content>
                            Gestion Colis
                            <Header.Subheader>
                                gerer les transacions de colis
                            </Header.Subheader>
                        </Header.Content>
                    </Header>
                </Grid.Row>

                <Grid.Row>

                    <Grid.Column width={3} only='tablet computer'>
                        <ColisAdd/>
                        <ColisFilter/>
                    </Grid.Column>

                    <Grid.Column width={13}>
                        <Grid.Row>
                            <ColisSearchBar/>
                        </Grid.Row>
                        <Grid.Row>
                            <ColisSearchResults/>
                        </Grid.Row>
                        <Grid.Row>
                            <h2></h2>
                            <ColisList/>
                        </Grid.Row>
                    </Grid.Column>

                </Grid.Row>

            </Grid>
            <div className='mgnBotMainGrid'>

            </div>
        </div>
    );
};