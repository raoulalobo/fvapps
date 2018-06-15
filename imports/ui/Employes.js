import React, { Component }  from 'react';
import { Grid , Header, Icon  } from 'semantic-ui-react'

import MainMenu from './MainMenu';
import EmployesList from './EmployesList';
import EmployesAdd from './EmployesAdd';
import EmployeSearch from './EmployeSearch';
//import EmployesHelpBar from './EmployesHelpBar';
//import EmployesExportData from './EmployesExportData';


export default class Employes extends React.Component{
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
                                Gestion des employes
                                <Header.Subheader>
                                    gerer les operation relatives aux employes
                                </Header.Subheader>
                            </Header.Content>
                        </Header>
                    </Grid.Row>

                    <Grid.Row>

                        <Grid.Column width={16}>
                            <Grid.Row>
                                <EmployesAdd/>
                            </Grid.Row>

                            <h2></h2>
                            <EmployeSearch/>

                            <Grid.Row>
                            </Grid.Row>

                            <Grid.Row>
                                <h2></h2>
                                <div className="tableOverflow">
                                    <EmployesList/>
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
