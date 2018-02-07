import { Meteor } from 'meteor/meteor';
import { Link , browserHistory} from 'react-router';
import React, { Component } from 'react';
import { Grid , Menu , Message , Modal , Form , Icon } from 'semantic-ui-react';
import { Accounts } from 'meteor/accounts-base';
import { createContainer } from 'meteor/react-meteor-data';

export class MainMenu extends Component {

    constructor (props) {
        super(props);
        this.state = {
            error: '',
            newPwd : '',
            old : '',
            currentUser : Meteor.user(),
            activeItem : '',
            menuColor: 'blue'
        }
    }
    componentDidMount() {
        Session.set('activeItem', browserHistory.getCurrentLocation().pathname );
    }
    componentWillReceiveProps(nextProps) {
        const { user } = nextProps;
        if (user) {
            this.props.Session.set('userId', user._id);
            this.setState({currentUser: user._id});
        }
    }
    shouldComponentUpdate(nextProps, nextState){

        return true;
    }
    onSubmit(e) {
        const { old , newPwd } = this.state;

        e.preventDefault();

        if ( old && newPwd ) {

            Accounts.changePassword( old , newPwd , (err) => {
                if (!err) {
                    this.handleClose();
                } else {
                    this.setState({ error: err.reason });
                }
            });

        } else {
            this.setState({ error: 'All field are required' });
        }

    }
    onChangeNewPwd(e) {
        this.setState({
            newPwd: e.target.value
        });
    }
    onChangeOldPwd(e) {
        this.setState({
            old: e.target.value
        });
    }
    handleOpen() {
        this.setState( { modalOpen: true } );
    }
    handleClose() {
        this.setState({
            modalOpen: false,
            error: '',
            old: '',
            newPwd: ''
        });
    }
    colisMenu(){
        if ( Roles.userIsInRole(this.state.currentUser, ['caisse','admin']) ) {
            const { activeItem } = this.props;
            return (

                <Menu.Item
                    as={Link}
                    to='/colis'
                    name='colis'
                    active={activeItem === '/colis'}>
                    <Icon name='shopping bag' />
                    Colis
                </Menu.Item>

            )
        }
    }
    caisseMenu(){
        if ( Roles.userIsInRole(this.state.currentUser, ['admin','caisse'] ) ) {
            const { activeItem } = this.props;
            return (

                <Menu.Item
                    as={Link}
                    to='/depenses'
                    name='depenses'
                    active={activeItem === '/depenses'}>
                    <Icon name='shop' />
                    Depenses
                </Menu.Item>

            )
        }
    }
    departsMenu(){
        if ( Roles.userIsInRole(this.state.currentUser,  ['admin','caisse','colis'] ) ) {
            const { activeItem } = this.props;
            return (

                <Menu.Item
                    as={Link}
                    to='/departs'
                    name='departs'
                    active={activeItem === '/departs'}>
                    <Icon name='bus' />
                    Departs
                </Menu.Item>

            )
        }
    }
    vidangesMenu(){
        if ( Roles.userIsInRole(this.state.currentUser,  'admin' ) ) {
            const { activeItem } = this.props;
            return (

                <Menu.Item
                    as={Link}
                    to='/vidanges'
                    name='vidanges'
                    active={activeItem === '/vidanges'}>
                    <Icon name='lab' />
                    Vidanges
                </Menu.Item>

            )
        }
    }
    resasMenu(){
        if ( Roles.userIsInRole(this.state.currentUser, ['caisse','admin'] ) ) {
            const { activeItem } = this.props;
            return (

                <Menu.Item
                    as={Link}
                    to='/resas'
                    name='resas'
                    active={activeItem === '/resas'}>
                    <Icon name='calendar' />
                    Resas
                </Menu.Item>

            )
        }
    }
    mobilemMenu(){
        if ( Roles.userIsInRole(this.state.currentUser, ['colis','admin'] ) ) {
            const { activeItem } = this.props;
            return (

                <Menu.Item
                    as={Link}
                    to='/mobilemoney'
                    name='mobilemoney'
                    active={activeItem === '/mobilemoney'}>
                    <Icon name='mobile' />
                    MoMo
                </Menu.Item>

            )
        }
    }
    paramMenu(){
        if ( Roles.userIsInRole(this.state.currentUser, ['caisse','admin'] ) ) {
            const { activeItem } = this.props;
            return (

                <Menu.Item
                    as={Link}
                    to='/parametres'
                    name='parametres'
                    active={activeItem === '/parametres'}>
                    <Icon name='setting' />
                    Params
                </Menu.Item>

            )
        }
    }
    userMenu(){
        if ( Roles.userIsInRole(this.state.currentUser, 'admin' ) ) {
            const { activeItem } = this.props;
            return (

                <Menu.Item
                    as={Link}
                    to='/users'
                    name='users'
                    active={activeItem === '/users'}>
                    <Icon name='users' />
                    Users
                </Menu.Item>

            )
        }
    }
    rightMenu(){
        return(

            <Menu.Menu position='right'>

                <Modal
                    onSubmit={this.onSubmit.bind(this)}
                    open={this.state.modalOpen}
                    onClose={this.handleClose.bind(this)}
                    dimmer='blurring'
                    size='small'
                    trigger={<Menu.Item onClick={this.handleOpen.bind(this)}><Icon name='edit' /></Menu.Item>}>
                    <Modal.Header>Changer votre mot de passe </Modal.Header>
                    <Modal.Content >
                        {this.state.error ?
                            <Message negative>
                                <Message.Header>Desole , nous ne pouvons effectuer cet enregistrement</Message.Header>
                                <p>{this.state.error}</p>
                            </Message>
                            :
                            undefined}
                        <Form>
                            <Form.Group widths='equal'>
                                <Form.Input type="password" label='Ancien mot de passe' value={this.state.old}
                                            onChange={this.onChangeOldPwd.bind(this)}/>
                                <Form.Input type="password" label='Nouveau mot de passe' value={this.state.newPwd}
                                            onChange={this.onChangeNewPwd.bind(this)}/>
                            </Form.Group>
                            <Form.Button fluid basic color='blue'>Valider</Form.Button>
                        </Form>
                    </Modal.Content>
                </Modal>

                <Menu.Item name='Se Deconnecter' onClick={() => Accounts.logout()} >
                    <Icon name='log out' />
                    LogOut
                </Menu.Item>
            </Menu.Menu>

        )
    }
    render() {
        const { menuColor } = this.state;

        return (
            <div>
                <Menu size='small' icon='labeled' color={menuColor} inverted>
                    <Grid>
                        <Grid.Row only='mobile tablet computer'>
                            {this.userMenu()}
                            {this.mobilemMenu()}
                            {this.vidangesMenu()}
                            {this.colisMenu()}
                            {this.departsMenu()}
                            {this.caisseMenu()}
                        </Grid.Row>
                    </Grid>

                    {this.rightMenu()}

                </Menu>
                {this.props.children}
            </div>

        )
    }
}

export default createContainer(() => {
    const activeItem = Session.get('activeItem');
    const user = Meteor.user() || null;
    return {
        Session,
        user,
        activeItem
    };
}, MainMenu);