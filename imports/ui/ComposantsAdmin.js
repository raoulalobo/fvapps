import React, { Component } from 'react';
import HotessesAdd from "./HotessesAdd";

class ComposantsAdmin extends Component {
    components = {
        hotesses: HotessesAdd
    };
    render() {
        const TagName = this.components[this.props.tag];
        return <TagName />
    }
}
export default ComposantsAdmin;
