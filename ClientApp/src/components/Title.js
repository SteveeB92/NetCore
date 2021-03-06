import React from 'react';
import PropTypes from "prop-types";
import'./css/Title.css';

export default class Title extends React.Component {
    constructor(props){
        super(props);
        this.state = {name: props.name};
    }

    render() {
        return (
            <h1 className="title">{this.state.name}</h1>
        );
    }
}

Title.propTypes = {
    name: PropTypes.string.isRequired
};