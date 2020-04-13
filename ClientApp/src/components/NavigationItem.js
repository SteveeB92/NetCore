import React from 'react';
import './css/NavigationItem.css';
import { Link } from 'react-router-dom';
import PropTypes from "prop-types";

export default class NavigationItem extends React.Component {
    constructor(props){
        super(props);
        this.state = {
            name: props.name,
            to: props.to
        };
    }

    render() {
        var className = this.props.isActive ? "blogNavItem active" : "blogNavItem";
        return (
            <Link className={className} to={this.state.to} onClick={() => this.props.setNavItemActive(this.state.name)}>{this.state.name}</Link>
        );
    }
}

NavigationItem.propTypes = {
    name: PropTypes.string.isRequired,
    to: PropTypes.string.isRequired,
    isActive: PropTypes.bool.isRequired,
    setNavItemActive: PropTypes.func.isRequired
};