import React from 'react';
import PropTypes from 'prop-types';
import './css/ButtonContainer.css';

export default class ButtonContainer extends React.Component {
    render() {
        return (
            <div className="buttonContainer">
                {this.props.children}
            </div>
        );
    }
}

ButtonContainer.propTypes = {
    children: PropTypes.array.isRequired
};