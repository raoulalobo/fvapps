import React from 'react';
import { List} from 'semantic-ui-react'

const ColisListEmptyItem = (props) => {
    return (
        <List.Item>
            <List.Content>
                {props.text}
            </List.Content>
        </List.Item>
    );
};

export default ColisListEmptyItem;