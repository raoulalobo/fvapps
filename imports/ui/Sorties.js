import React, { Component }  from 'react';
import { Grid , Header, Icon , Button } from 'semantic-ui-react'
import { Link , browserHistory} from 'react-router';
import MainMenu from './MainMenu';
import SortiesList from './SortiesList';
//import SortiesAdd from './SortiesAdd';
import SortieSearch from './SortiesSearch';
import SortiesExportData from './SortiesExportData';
import {Meteor} from "meteor/meteor";


export default class Sorties extends React.Component{
  constructor(props) {
    super(props);
    this.state = {
      currentUser : Meteor.user(),
    }
  }
  userMenu(){
    if ( Roles.userIsInRole(this.state.currentUser, 'admin' ) ) {
      return (

          <Button
              as={Link}
              to='/sortiesajout'
              name='sortiesajout' size='mini'>
            Ajouter 01 sortie
          </Button>

      )
    }
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
                <Icon circular color='red' name='arrow right' />
                <Header.Content>
                  Gestion des historiques sorties
                  <Header.Subheader>
                    gerer les operation relatives aux sorties
                  </Header.Subheader>
                </Header.Content>
              </Header>
            </Grid.Row>

            <Grid.Row>

              <Grid.Column width={16}>
                <Grid.Row>
                  {this.userMenu()}
                  <SortiesExportData/>
                </Grid.Row>

                <h2></h2>
                <SortieSearch/>

                <Grid.Row>
                  <h2></h2>
                  <div className="tableOverflow">
                    <SortiesList/>
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
