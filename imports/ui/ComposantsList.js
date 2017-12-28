import React, { Component } from 'react';
import HotessesList from "./HotessesList";

class ComposantsList extends Component {
    components = {
        hotesses: HotessesList
    };
    render() {
        const TagName = this.components[this.props.tag];
        return <TagName />
    }
}
export default ComposantsList;
