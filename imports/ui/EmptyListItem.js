import React from 'react';
import { List} from 'semantic-ui-react'

const EmptyListItem = (props) => {
    return (
        <List.Item>
            <List.Content>
                {props.text}
            </List.Content>
        </List.Item>
    );
};

export default EmptyListItem;