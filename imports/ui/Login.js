import React from 'react';
import PropTypes from 'prop-types';
import { Link } from 'react-router';
import { Meteor } from 'meteor/meteor';
import { Grid, Button, Form, Message } from 'semantic-ui-react'
import { createContainer } from 'meteor/react-meteor-data';

export class Login extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      error: ''
    };
  }
  onSubmit(e) {
    e.preventDefault();

    let email = this.refs.email.value.trim();
    let password = this.refs.password.value.trim();

    if ( Meteor.status().connected ) {
      this.props.loginWithPassword({email}, password, (err) => {

        if (err) {
          this.setState({error: err.reason });
          console.log( err );
        } else {
          this.setState({error: ''});
        }
      });
    } else {
      this.setState({error: Meteor.status().status });
      Meteor.reconnect()
    }


  }
  render() {
    return (
      <div>
        <div className="mgnLogin">
          <Grid centered columns={2} verticalAlign='middle' >
            <Grid.Column computer={4} tablet={5} mobile={9}>
                {this.state.error ?
                    <Message negative>
                      <Message.Header>
                        Acces refuse.
                      </Message.Header>
                      <p>{this.state.error}</p>
                    </Message>
                    :
                    undefined
                }
              <Form onSubmit={this.onSubmit.bind(this)} noValidate>
                <Form.Field>
                  <input ref="email" placeholder='Email ...' />
                </Form.Field>
                <Form.Field>
                  <input type="password" ref="password" placeholder='Mot de passe ...' />
                </Form.Field>
                <Button fluid color='blue' type='submit'>Se Connecter</Button>
              </Form>
            </Grid.Column>

          </Grid>
        </div>
      </div>
    );
  }
}

Login.propTypes = {
  loginWithPassword: PropTypes.func.isRequired
};

export default createContainer(() => {
  return {
    loginWithPassword: Meteor.loginWithPassword
  };
}, Login);
