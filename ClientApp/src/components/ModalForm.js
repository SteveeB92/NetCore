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
            return stockItem[columnDetail.fieldNameFormatted ? columnDetail.fieldNameFormatted : columnDetail.fieldName];
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

    render() {
        if (this.props.show) {
            return  <Modal show={this.props.show} size="lg" aria-labelledby="contained-modal-title-vcenter" centered onHide={() => this.props.onClose()} >
                        <Modal.Header closeButton >
                        <Modal.Title id="contained-modal-title-vcenter">
                            {this.props.name}
                        </Modal.Title>
                        </Modal.Header>
                        <Modal.Body>
                            <form>
                                {this.props.columnDetails.map(columnDetail => 
                                    <div key={"Input" + columnDetail.key} className="form-group">
                                        <label htmlFor={columnDetail.key}>{columnDetail.caption}</label>
                                        <input type={this.getInputType(columnDetail.dataType)} className="form-control" id={"Input" + columnDetail.key} 
                                                defaultValue={this.getDefaultValue(this.props.stockItem, columnDetail)} />
                                    </div>
                                )}
                            </form>
                        </Modal.Body>
                        <Modal.Footer>
                            <Button onClick={() => this.props.onClose()} name="Close" isLoading={false} isPrimary={false}/>
                            <Button onClick={() => this.props.onSubmit(this.props.stockItem?.id)} name="Save" isLoading={false} isPrimary={true}/>
                        </Modal.Footer>
                    </Modal>
        }
        else {
            return <></>
        }
    };
}

ModalForm.propTypes = {
    show: PropTypes.bool.isRequired,
    onClose: PropTypes.func.isRequired,
    onSubmit: PropTypes.func.isRequired,
    columnDetails: PropTypes.array.isRequired,
    stockItem: PropTypes.object,
    name: PropTypes.string.isRequired
};