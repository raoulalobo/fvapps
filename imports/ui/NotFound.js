import React, { Component }  from 'react';
import { Link } from 'react-router';
import { Grid , Header, Icon  } from 'semantic-ui-react';


export default class NotFound extends React.Component{
    constructor(props) {
        super(props);
    }
    render(){
        return (
            <div>
                <div className='mgnTopMainGrid'></div>
                <Grid columns={3}>
                    <Grid.Row>
                        <Grid.Column>

                        </Grid.Column>
                        <Grid.Column textAlign='center'>
                            <div className="boxed-view__box">
                                <h2>Page inexistante ou MAJ serveurs</h2>
                                <p>Bien vouloir contacter le service IT.</p>
                                <Link to="/" className="button button--link">CLIQUER POUR REVENIR A L'ACCUEIL</Link>
                            </div>
                        </Grid.Column>
                        <Grid.Column>

                        </Grid.Column>
                    </Grid.Row>

                </Grid>
                <div className='mgnBotMainGrid'></div>
            </div>
        )
    }

};