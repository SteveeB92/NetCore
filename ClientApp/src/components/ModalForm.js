import React from 'react';
import PropTypes from "prop-types";
import Modal from "react-bootstrap/Modal";
import './../../node_modules/bootstrap/scss/bootstrap.scss';
import Button from './Button';

export default class ModalForm extends React.Component {
    getInputType(dataType){
        switch(dataType){
            case "number":
                return "number";
            case "date":
                return "date";
            case "file":
                return "file";
            default:
                return "text";
        }
    }

    getDefaultValue(stockItem, columnDetail){
        if (stockItem){
            return stockItem[columnDetail.fieldNameFormatted ? columnDetail.fieldNameFormatted : columnDetail.fieldName] 
                ?? this.getDefaultValue(null, columnDetail);
        }
        else{
            switch(columnDetail.dataType){
                case "date":
                    // Return the current date in the format of yyyy-MM-dd otherwise the control doesn't default correctly
                    return (new Date()).toISOString().split('T')[0];
                default:
                    return "";
            }
        }
    }

    getCommitButton(formId) {
        if (this.props.name === "Upload")
            return <Button form={formId} name="Upload" isLoading={false} isPrimary={true} type="submit" />
        else 
            return <Button onClick={() => this.props.onSubmit(this.props.stockItem?.id)} name="Save" isLoading={false} isPrimary={true} />
    }

    isMobileScreen(){
        return window.matchMedia("only screen and (max-width: 760px)").matches;
    }
    
    multiAddDelete(stockItem){
        let localStockItems = this.props.stockItems;
        for(let i = 0; i < localStockItems.length; i++){
            if(localStockItems[i].tempId === stockItem.tempId){
                localStockItems.splice(i, 1);
                this.props.setMultiAddStockItems(localStockItems);
                break;
            }
        }
    }

    getFormBody(formId) {        
        if (this.props.stockItems){
            return <>
                    {this.props.columnDetails.map(columnDetail => 
                        <label key={"label" + columnDetail.key} htmlFor={columnDetail.key} style={{"width": columnDetail.width + "%", "display": "inline-block" }}>
                            {columnDetail.caption}
                        </label>
                    )}
                    {this.props.stockItems.map(stockItem => 
                        <div key={"input" + stockItem.tempId}>
                            {this.props.columnDetails.map(columnDetail => 
                                <input key={stockItem.productName + columnDetail.key} type={this.getInputType(columnDetail.dataType)} 
                                    style={{"width": columnDetail.width + "%", "display": "inline-block" }} className="form-control" 
                                    id={"input" + stockItem.tempId + columnDetail.key} 
                                    defaultValue={this.getDefaultValue(stockItem, columnDetail)} name={"input" + columnDetail.key} />
                            )}
                            <Button name={this.isMobileScreen() ? "X" : "Delete"} onClick={() => this.multiAddDelete(stockItem)} isDanger={true} />
                        </div>
                    )}
                </>;
        }
        else {
            return this.getFormInnerBody(formId, this.props.stockItem);
        }
    }

    getFormInnerBody(formId, stockItem) {
        return <form id={formId} onSubmit={(e) => this.props.onSubmit(e)} >
                    {this.props.columnDetails.map(columnDetail => 
                        <div key={"input" + columnDetail.key} >
                            <label htmlFor={columnDetail.key}>{columnDetail.caption}</label>
                            <input type={this.getInputType(columnDetail.dataType)} className="form-control" id={"input" + columnDetail.key} 
                                    defaultValue={this.getDefaultValue(stockItem, columnDetail)} name={"input" + columnDetail.key} />
                        </div>
                    )}
                </form>
    }

    render() {
        if (this.props.show) {
            let formId = 'UploadForm';

            return  <Modal show={this.props.show} size="lg" aria-labelledby="contained-modal-title-vcenter" centered onHide={() => this.props.onClose()} >
                        <Modal.Header closeButton >
                        <Modal.Title id="contained-modal-title-vcenter">
                            {this.props.name}
                        </Modal.Title>
                        </Modal.Header>
                        <Modal.Body>
                            {this.getFormBody(formId)}
                        </Modal.Body>
                        <Modal.Footer>
                            <Button onClick={() => this.props.onClose()} name="Close" isLoading={false} isPrimary={false} />
                            {this.getCommitButton(formId)}
                        </Modal.Footer>
                    </Modal>
        }
        else {
            return <></>
        }
    };
}

ModalForm.propTypes = {
    show: PropTypes.bool,
    onClose: PropTypes.func.isRequired,
    onSubmit: PropTypes.func.isRequired,
    columnDetails: PropTypes.array.isRequired,
    stockItem: PropTypes.object,
    stockItems: PropTypes.array,
    name: PropTypes.string.isRequired
};