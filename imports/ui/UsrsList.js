import React from 'react';
import PropTypes from 'prop-types';
import { Meteor } from 'meteor/meteor';
import { createContainer } from 'meteor/react-meteor-data';
import { List } from 'semantic-ui-react'

import {} from '../api/users';
import UsrsListItem from './UsrsListItem';
import ColisListEmptyItem from './ColisListEmptyItem';

export const UsrsList = (props) => {
    return (
        <List celled selection verticalAlign='middle'>
            { props.usrs.length === 0 ? <ColisListEmptyItem text="No Items, if is an unexpected result please contact the admin"/> : undefined }
            { props.loading && !!props.usrs.length ? <ColisListEmptyItem text="Loading Data , please wait ..."/>  : undefined }
            {!!props.usrs.length && !props.loading ? props.usrs.map((usr) => {
                return <UsrsListItem key={usr._id} usr={usr}/>;
            }) : undefined }
        </List>
    );
};

UsrsList.propTypes = {
    usrs: PropTypes.array
};

export default createContainer(() => {

    const usrsHandle = Meteor.subscribe('allUsers');
    const loading = !usrsHandle.ready();


    let reactiveSearch = {} ;

    return {
        loading,
        usrs: Meteor.users.find().fetch()
    };
}, UsrsList);
