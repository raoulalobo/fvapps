import React, { Component }  from 'react';
import { Grid , Header, Icon , Button } from 'semantic-ui-react'
import { Link , browserHistory} from 'react-router';
import MainMenu from './MainMenu';
import SortiesList from './SortiesList';
import SortiesAdd from './SortiesAdd';
import SortieSearch from './SortiesSearch';
import {Meteor} from "meteor/meteor";


export default class SortiesAjout extends React.Component{
  constructor(props) {
    super(props);
    this.state = {
      currentUser : Meteor.user(),
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
                <Icon circular name='arrow right' />
                <Header.Content>
                  Ajouts de sorties
                  <Header.Subheader>
                    gerer les ajouts de sorties
                  </Header.Subheader>
                </Header.Content>
              </Header>
            </Grid.Row>

            <Grid.Row>

              <Grid.Column width={16}>
                <Grid.Row>
                  <SortiesAdd/>
                </Grid.Row>

                <h2></h2>

                <Grid.Row>
                  <h2></h2>
                  <div className="tableOverflow">
                    {/*<SortiesList/>*/}
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
