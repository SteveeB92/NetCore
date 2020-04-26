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

        if (this.props.type === "submit")
            return <button form={this.props.form} type="submit" className={className} disabled={this.props.isLoading}>{this.props.name}</button>;
        else 
            return <button type={this.props.type ?? "button"} className={className} onClick={this.props.onClick} disabled={this.props.isLoading}>{this.props.name}</button>;
    }
}

Button.propTypes = {
    name: PropTypes.string.isRequired,
    onClick: PropTypes.func.isRequired,
    isLoading: PropTypes.bool.isRequired,
    form: PropTypes.string,
    isPrimary: PropTypes.bool,
    isDanger: PropTypes.bool,
    isSmall: PropTypes.bool,
    type: PropTypes.string
};