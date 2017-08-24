import React, { Component }  from 'react';
import { Grid , Header, Icon  } from 'semantic-ui-react'

import MainMenu from './MainMenu';
import DepensesList from './DepensesList';
import DepensesAdd from './DepensesAdd';
import DepenseSearch from './DepenseSearch';
import DepensesHelpBar from './DepensesHelpBar';


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
                            <Icon circular name='shop' />
                            <Header.Content>
                                Gestion des depenses
                                <Header.Subheader>
                                    gerer les operation relatives aux depenses
                                </Header.Subheader>
                            </Header.Content>
                        </Header>
                    </Grid.Row>

                    <Grid.Row>

                        <Grid.Column width={16}>
                            <Grid.Row>
                                <DepensesAdd/>
                            </Grid.Row>

                            <h2></h2>
                            <DepenseSearch/>

                            <Grid.Row>
                                <DepensesHelpBar/>
                            </Grid.Row>

                            <Grid.Row>
                                <h2></h2>
                                <div className="tableOverflow">
                                    <DepensesList/>
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
