import React, { Component }  from 'react';
import { Grid , Header, Icon , Button } from 'semantic-ui-react'

import MainMenu from './MainMenu';
import VidangesList from './VidangesList';
import VidangesAdd from './VidangesAdd';


export default class Vidanges extends React.Component{
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
                            <Icon circular name='lab' />
                            <Header.Content>
                                Gestion des historiques vidanges
                                <Header.Subheader>
                                    gerer les operation relatives aux vidanges
                                </Header.Subheader>
                            </Header.Content>
                        </Header>
                    </Grid.Row>

                    <Grid.Row>

                        <Grid.Column width={16}>
                            <Grid.Row>
                                <VidangesAdd/>
                                <Button size='mini'>
                                    Mini
                                </Button>
                            </Grid.Row>

                            <h2></h2>


                            <Grid.Row>
                                <h2></h2>
                                <div className="tableOverflow">
                                    <VidangesList/>
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
