import React from 'react';
import PropTypes from "prop-types";
import './../../node_modules/bootstrap/scss/bootstrap.scss';

export default class TableLightBody extends React.Component {
    addColumnIfExists(columnDetails, columnName, stockItemId, isLoading){
        let column = columnDetails.find(column => column[columnName]);
        if(column)
            return <td key={column.key}>{<button onClick={() => column.onClick(stockItemId)} disabled={isLoading}>{column.caption}</button>}</td>;
        else
            return null;
    }

    render() {
        return  <tbody>
                    {this.props.stockItems.map(stockItem => 
                        <tr key={stockItem.id}>
                            {this.props.columnDetails.filter(column => column.isDBField).map(columnDetail => 
                                <td key={columnDetail.key}>{stockItem[columnDetail.fieldName]}</td>
                            )}
                            {this.addColumnIfExists(this.props.columnDetails, 'isEdit', stockItem.id, this.props.isLoading)}
                            {this.addColumnIfExists(this.props.columnDetails, 'isDelete', stockItem.id, this.props.isLoading)}
                        </tr>
                    )}
                </tbody>;
    }
}

TableLightBody.propTypes = {
    columnDetails: PropTypes.array.isRequired,
    stockItems: PropTypes.array.isRequired,
    isLoading: PropTypes.bool.isRequired
};