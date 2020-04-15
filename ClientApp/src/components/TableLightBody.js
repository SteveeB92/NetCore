import React from 'react';
import PropTypes from "prop-types";
import './../../node_modules/bootstrap/scss/bootstrap.scss';
import Button from './Button';

export default class TableLightBody extends React.Component {
    addColumnIfExists(columnDetails, columnName, onClickValue, isLoading, isDanger){
        let column = columnDetails.find(column => column[columnName]);
        if(column)
            return <td key={column.key}>
                        <Button onClick={() => column.onClick(onClickValue)} isLoading={isLoading} name={column.caption} isSmall={true} isDanger={isDanger} />
                    </td>;
        else
            return null;
    }

    render() {
        return  <tbody>
                    {this.props.stockItems.map(stockItem => 
                        <tr key={stockItem.id}>
                            {this.props.columnDetails.filter(column => column.isDBField).map(columnDetail => 
                                <td key={columnDetail.key}>{stockItem[columnDetail.fieldNamePretty ? columnDetail.fieldNamePretty : columnDetail.fieldName]}</td>
                            )}
                            {this.addColumnIfExists(this.props.columnDetails, 'isEdit', stockItem, this.props.isLoading, false)}
                            {this.addColumnIfExists(this.props.columnDetails, 'isDelete', stockItem.id, this.props.isLoading, true)}
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