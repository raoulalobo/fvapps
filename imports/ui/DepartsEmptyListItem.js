import React from 'react';
import { Table, Container } from 'semantic-ui-react'

const DepartsEmptyListItem = (props) => {
    return (
        <Table.Row>
            <Table.Cell colSpan='9'>
                <Container textAlign='center'>
                    {props.text}
                </Container>
            </Table.Cell>
        </Table.Row>
    );
};

export default DepartsEmptyListItem;