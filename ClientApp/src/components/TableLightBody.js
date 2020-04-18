import React from 'react';
import PropTypes from "prop-types";
import './../../node_modules/bootstrap/scss/bootstrap.scss';
import Button from './Button';
import './css/TableRow.css';

export default class TableLightBody extends React.Component {
    constructor(props){
        super(props);

        this.handleTouchStartEvent = this.handleTouchStartEvent.bind(this);
        this.handleTouchMoveEvent = this.handleTouchMoveEvent.bind(this);
        this.handleTouchEndEvent = this.handleTouchEndEvent.bind(this);

        this.state = {
            swipeTargetRowID: null,
            swipeStartX: null,
            beingSwiped: false
        }
    }

    addColumnIfExists(columnDetail, columnName, stockItem, isLoading, isDanger, isForceShow){
        let isMobile = this.isMobileScreen();
        
        if (columnDetail.isMobile || !isMobile || isForceShow)
        {
            let column = columnDetail.find(column => column[columnName]);
            if(column) {
                return <div className="col" key={column.key} style={this.getColumnStyle(columnDetail, columnName, true)}>
                            <Button onClick={() => column.onClick(stockItem)} isLoading={isLoading} name={column.caption} isSmall={true} isDanger={isDanger} />
                       </div>;
            }
        }

        return null;
    }

    getColumnStyle(columnDetails, isForceShowColumnName, isButton){
        let isMobile = this.isMobileScreen();

        let visibleColumns = columnDetails.filter(column => column.isMobile || !isMobile || column.columnName === isForceShowColumnName).length;

        let width = (100 / visibleColumns) - 3;

        return {
            flex: "1 0 " + width + "%",
            paddingTop: (isButton ? "0" : "4") + "px",
            paddingBottom: (isButton ? "0" : "4") + "px"
        };
    }

    isMobileScreen(){
        return window.matchMedia("only screen and (max-width: 760px)").matches;
    }

    getDisplayValue(columnDetail, stockItem){
        if (columnDetail.displayFormat) {
            let concatString = "";
            columnDetail.displayFormat.split(" ").forEach(fieldName => concatString += stockItem[fieldName]);
            return concatString;
        }
        else {
            return stockItem[columnDetail.fieldName];
        }
    }

    handleTouchStartEvent(touchStartEvent, stockItem) {
        let elementTouched = touchStartEvent.targetTouches[0];
        
        if (elementTouched.target.id){
            this.longPressTimeout = setTimeout(() => this.props.columnDetails.find(column => column.isEdit).onClick(stockItem), 1000);

            this.setState({
                swipeTargetRowID: stockItem.id,
                swipeStartX: elementTouched.clientX,
                swipeCurrentX: elementTouched.clientX,
                beingSwiped: true
            });
            
            this.props.showMobileDeleteButton(null);
        }
    }

    handleTouchMoveEvent(touchMoveEvent) {
        if (this.state.beingSwiped) {
            this.setState({
                swipeCurrentX: touchMoveEvent.targetTouches[0].clientX,
            });
        }

        if (this.isSwipedEnoughToShow(this.state.swipeCurrentX, this.state.swipeStartX))
            this.props.showMobileDeleteButton(this.state.swipeTargetRowID);
        else 
            this.props.showMobileDeleteButton(null);

        if (Math.abs(this.state.swipeStartX - this.state.swipeCurrentX) > 20)
           clearTimeout(this.longPressTimeout);
    }

    handleTouchEndEvent(){ 
        clearTimeout(this.longPressTimeout);
        
        if (this.isSwipedEnoughToShow(this.state.swipeCurrentX, this.state.swipeStartX))
            this.props.showMobileDeleteButton(this.state.swipeTargetRowID);
        
        this.setState({
            swipeStartX: null,
            swipeCurrentX: null,
            beingSwiped: false
        });
    }

    isSwipedEnoughToShow(currentX, startX){
        return currentX && startX - currentX > 95;
    }

    handleOffset(id, isLeft){
        let intialOffset = -15;
        let offset = intialOffset;
        if (this.state.swipeTargetRowID === id)
        {
            offset = this.state.swipeCurrentX - this.state.swipeStartX - intialOffset;

            if(isLeft && offset > intialOffset){
                offset = intialOffset;
            }
            else if (!isLeft) {
                offset *= -1;
                if (offset < intialOffset) {
                    offset = intialOffset;
                }
            }
        }

        return offset + 'px';
    }

    getRowStyles(id, mobileShowDeleteButtonRowID) {
        if (id === mobileShowDeleteButtonRowID)
        {
            return {
                marginLeft: '-55px',
                marginRight: '-15px'
            }
        }
        else {
            return {
                marginLeft: this.handleOffset(id, true),
                marginRight: this.handleOffset(id, false)
            }
        }
    }

    render() {
        return  <>
                {this.props.stockItems.map(stockItem => 
                    <div className="rowWrapper" id={stockItem.id} key={stockItem.id}>
                        <div className="row" style={this.getRowStyles(stockItem.id, this.props.mobileShowDeleteButtonRowID)}>
                        {this.props.columnDetails.filter(column => column.isDBField && column.isDisplayField).map(columnDetail => 
                            <div className="col" id={stockItem.id + columnDetail.key} key={columnDetail.key}
                                 style={this.getColumnStyle(this.props.columnDetails, this.props.mobileShowDeleteButtonRowID === stockItem.id ? 'isDelete' : '')}
                                 onTouchStart={touchStartEvent => this.handleTouchStartEvent(touchStartEvent, stockItem)}
                                 onTouchMove={touchMoveEvent => this.handleTouchMoveEvent(touchMoveEvent)}
                                 onTouchEnd={() => this.handleTouchEndEvent()}>
                                     {this.getDisplayValue(columnDetail, stockItem)}
                            </div>
                        )}
                        {this.addColumnIfExists(this.props.columnDetails, 'isEdit', stockItem, this.props.isLoading, false, false)}
                        {this.addColumnIfExists(this.props.columnDetails, 'isDelete', stockItem, this.props.isLoading, true, 
                                                this.props.mobileShowDeleteButtonRowID === stockItem.id)}
                        </div>
                    </div>
                )}
                </>;
    }
}

TableLightBody.propTypes = {
    columnDetails: PropTypes.array.isRequired,
    stockItems: PropTypes.array.isRequired,
    isLoading: PropTypes.bool.isRequired,
    mobileShowDeleteButtonRowID: PropTypes.bool,
    showMobileDeleteButton: PropTypes.func
};