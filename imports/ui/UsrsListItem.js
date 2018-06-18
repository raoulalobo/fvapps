import React from "react";
import PropTypes from "prop-types";
import { Session } from "meteor/session";
import { createContainer } from "meteor/react-meteor-data";
import { Grid, List, Button } from "semantic-ui-react";

export class UsrsListItem extends React.Component {
  onClickButton(e, { name }) {
    console.log(`${name}`);
    var confirmation = confirm(
      "Role of (" +
        this.props.usr.emails[0].address +
        ") will be modified. Confirm ?"
    );
    if (confirmation) {
      this.props.call("add.role", this.props.usr._id, `${name}`);
    }
  }
  render() {
    return (
      <List.Item>
        <List.Content floated="right">
          <Grid columns="equal">
            <Grid.Row>
              <Grid.Column>
                <Button
                  basic
                  name="colis"
                  size="mini"
                  onClick={this.onClickButton.bind(this)}
                >
                  Colis
                </Button>

                <Button
                  basic
                  name="caisse"
                  size="mini"
                  onClick={this.onClickButton.bind(this)}
                >
                  Caisse
                </Button>

                <Button
                  basic
                  name="admin"
                  size="mini"
                  onClick={this.onClickButton.bind(this)}
                >
                  Admin
                </Button>

                <Button
                  basic
                  color="red"
                  icon="remove"
                  size="mini"
                  onClick={() => {
                    const changeState = confirm(
                      "Vous confirmez la suppression du user " +
                        this.props.usr.emails[0].address.split("@")[0] +
                        " ? "
                    );
                    if (changeState) {
                      this.props.call(
                        "delete.user",
                        this.props.usr._id,
                        (err, res) => {
                          if (!err) {
                            Bert.alert(
                              "Suppression effectuee.",
                              "danger",
                              "growl-top-right",
                              "fa-check"
                            );
                          }
                        }
                      );
                    }
                  }}
                />
              </Grid.Column>
            </Grid.Row>
          </Grid>
        </List.Content>
        {/*<Image avatar src='/assets/images/avatar/small/lena.png' />*/}
        <List.Content>
          <List.Header>
            {this.props.usr.emails[0].address.split("@")[0]} ( {this.props.usr.emails[0].address} )
          </List.Header>
          {!!this.props.usr.roles
            ? 'Droit: ' + this.props.usr.roles
            : 'Aucun droit'}
        </List.Content>
      </List.Item>
    );
  }
}

UsrsListItem.propTypes = {
  usr: PropTypes.object,
  Session: PropTypes.object
};

export default createContainer(() => {
  return {
    Session,
    call: Meteor.call
  };
}, UsrsListItem);
