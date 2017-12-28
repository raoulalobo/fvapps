import React, { Component }  from 'react';
import { Grid , Header, Icon  } from 'semantic-ui-react'

import MainMenu from './MainMenu';
import MmoneysList from './MmoneysList';
import MmoneysAdd from './MmoneysAdd';
import MmoneySearch from './MmoneySearch';
import MmoneysHelpBar from './MmoneysHelpBar';


export default class Mmoneys extends React.Component{
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
                            <Icon circular name='mobile' />
                            <Header.Content>
                                Gestion des paiements mobiles
                                <Header.Subheader>
                                    gerer les operation relatives aux paiements mobiles
                                </Header.Subheader>
                            </Header.Content>
                        </Header>
                    </Grid.Row>

                    <Grid.Row>

                        <Grid.Column width={16}>
                            <Grid.Row>
                                <MmoneysAdd/>
                            </Grid.Row>

                            <h2></h2>

                            <MmoneySearch/>

                            <Grid.Row>
                                <MmoneysHelpBar/>
                            </Grid.Row>

                            <Grid.Row>
                                <h2></h2>
                                <div className="tableOverflow">
                                    <MmoneysList/>
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
