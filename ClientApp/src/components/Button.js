import React from 'react';
import PropTypes from "prop-types";
import './../../node_modules/bootstrap/scss/bootstrap.scss';

export default class Button extends React.Component {
    render() {
        let className = "btn";

        if (this.props.isPrimary) className += " btn-primary";
        else if (this.props.isDanger) className += " btn-danger";
        else className += " btn-secondary";

        if (this.props.isSmall) className += " btn-sm";

        return <button type="button" className={className} onClick={this.props.onClick} disabled={this.props.isLoading}>{this.props.name}</button>;
    }
}

Button.propTypes = {
    name: PropTypes.string.isRequired,
    onClick: PropTypes.func.isRequired,
    isLoading: PropTypes.bool.isRequired,
    isPrimary: PropTypes.bool,
    isDanger: PropTypes.bool,
    isSmall: PropTypes.bool
};