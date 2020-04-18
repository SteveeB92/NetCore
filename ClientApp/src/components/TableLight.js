import React from 'react';
import './../../node_modules/bootstrap/scss/bootstrap.scss';
import PropTypes from "prop-types";
import TableLightHeader from './TableLightHeader';
import TableLightBody from './TableLightBody';

export default class TableLight extends React.Component {
    render() {
        return  <div className="container">
                    <TableLightHeader columnDetails={this.props.columnDetails} />
                    <TableLightBody columnDetails={this.props.columnDetails} stockItems={this.props.stockItems} isLoading={this.props.isLoading}
                                    mobileShowDeleteButtonRowID={this.props.mobileShowDeleteButtonRowID} showMobileDeleteButton={this.props.showMobileDeleteButton} />
                </div>;
    }
}

TableLight.propTypes = {
    columnDetails: PropTypes.array.isRequired,
    stockItems: PropTypes.array.isRequired,
    isLoading: PropTypes.bool.isRequired,
    mobileShowDeleteButtonRowID: PropTypes.string,
    showMobileDeleteButton: PropTypes.func
};