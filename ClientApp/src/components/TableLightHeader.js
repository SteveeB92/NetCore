import React from 'react';
import PropTypes from "prop-types";
import './../../node_modules/bootstrap/scss/bootstrap.scss';

export default class TableLightHeader extends React.Component {
    render() {
        return <thead className="thead-light">
                   <tr>
                       {this.props.columnDetails.map(columnDetail => 
                           <th key={columnDetail.key} scope="col">{columnDetail.caption}</th>
                       )}
                   </tr>
               </thead>;
    }
}

TableLightHeader.propTypes = {
    columnDetails: PropTypes.array.isRequired
};