import React from 'react';
import PropTypes from "prop-types";
import './../../node_modules/bootstrap/scss/bootstrap.scss';

export default class TableLightHeader extends React.Component {
    render() {
        let isMobile = window.matchMedia("only screen and (max-width: 760px)").matches;

        let columnsToDisplay = this.props.columnDetails.filter(column => column.isDisplayField && (!isMobile || column.isMobile));

        return  <div className="row">
                    {columnsToDisplay.map(columnDetail => 
                        <div className="col h5" key={columnDetail.key}>{columnDetail.caption}</div>
                    )}
                </div>;
    }
}

TableLightHeader.propTypes = {
    columnDetails: PropTypes.array.isRequired
};