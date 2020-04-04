import React, { Component } from 'react';
import './css/NavigationItem.css';
import { Link } from 'react-router-dom';

export default class NavigationItem extends React.Component {
    constructor(props){
        super(props);
        this.state = {
            name: props.name,
            to: props.to
        };
    }

    isActive(){
        return this.props.name === this.props.previousClick;
    }

    render() {
        var className = this.isActive() ? "blogNavItem active" : "blogNavItem";
        return (
            <Link className={className} to={this.state.to} onClick={() => this.props.addActive(this.state.name)}>{this.state.name}</Link>
        );
    }
}