import React from 'react';
import TableLight from './TableLight';
import ModalForm from './ModalForm';
import $ from 'jquery';
import Button from './Button';
import ButtonContainer from './ButtonContainer';
import './css/Container.css';

export default class StockList extends React.Component {
    constructor(props) {
        super(props);
        this.onEdit = this.onEdit.bind(this);
        this.onDelete = this.onDelete.bind(this);
        this.onModalClose = this.onModalClose.bind(this);
        this.onEditSubmit = this.onEditSubmit.bind(this);
        this.onAddSubmit = this.onAddSubmit.bind(this);
        this.onMultiAddSubmit = this.onMultiAddSubmit.bind(this);
        this.onUploadSubmit = this.onUploadSubmit.bind(this);
        this.setMultiAddStockItems = this.setMultiAddStockItems.bind(this);
        this.showMobileDeleteButton = this.showMobileDeleteButton.bind(this);
        this.state = { 
            columnDetails: [
                {key:1, caption: 'Product', fieldName: 'productName', isDBField: true, isDisplayField: true, dataType: "string", 
                    isMobile: true, width: "30" },
                {key:2, caption: 'Quantity', fieldName: 'quantity', isDBField: true, isDisplayField: true, displayFormat: 'quantity unit',
                    dataType: "number", isMobile: true, width: "15" },
                {key:3, caption: 'Unit', fieldName: 'unit', isDBField: true, isDisplayField: false, dataType: "string", isMobile: true,
                    width: "15"},
                {key:4, caption: 'Purchased', fieldName: 'purchasedDT', fieldNameFormatted: 'purchasedDTFormatted', 
                    displayFormat: 'purchasedDTPretty', isDBField: true, isDisplayField: true, dataType: "date", isMobile: true,
                    width: "27"},
                {key:5, caption: 'Edit', isDisplayField: true, isEdit: true, onClick: this.onEdit},
                {key:6, caption: 'Delete', isDisplayField: true, isDelete: true, onClick: this.onDelete}],
            uploadColumnDetails: [
                {key:1, caption: 'Receipt', fieldName: 'filePath', isDBField: true, dataType: "file"}
            ],
            stockItems: [], 
            loading: true
        };
    }

    componentDidMount() {
        this.populateStockData();
    }

    onEdit(editStockItem){
        this.setState({ stockItems: this.state.stockItems, loading: false, edit: true, editStockItem: editStockItem });
    }

    onModalClose(){
        if (!this.state.loading)
            this.setState({ edit: false, add: false, upload: false, editStockItem: {}, multiAdd: false, multiAddStockItems: {} });
    }
    
    onEditSubmit(id){
        let newValues = { id: id };        
        this.getValuesFromModal(this.state.columnDetails, newValues);
        
        this.callFetch('edit', newValues, true);
        this.setState({ edit: false, editStockItem: {} });
    }
    
    onAddSubmit(){
        let newValues = { };
        this.getValuesFromModal(this.state.columnDetails, newValues);
        
        this.callFetch('create', newValues, true);
        this.setState({ add: false });
    }
    
    setMultiAddStockItems(stockItems){
        this.setState({multiAddStockItems: stockItems});
    }

    async onMultiAddSubmit(){
        for (const stockItem of this.state.multiAddStockItems){
            let newValues = { };
            this.getValuesFromModal(this.state.columnDetails, newValues, stockItem.tempId);
            await this.callFetch('create', newValues, true);
        }
        this.setState({ multiAdd: false });
    }
    
    async onUploadSubmit(e){
        e.preventDefault();
        console.log(e);
        const data = new FormData(e.target);
        
        await this.callFetch('uploadReceipt', data, false, "multiAddStockItems");
        this.setState({ upload: false, multiAdd: true });
    }

    getValuesFromModal(columnDetails, stockItem, additionalKeyValue){
        columnDetails.filter(column => column.isDBField).forEach(column => stockItem[column.fieldName] = $("#input" + additionalKeyValue + column.key).val());
        return stockItem;
    }

    showMobileDeleteButton(rowID){
        this.setState({mobileShowDeleteButtonRowID: rowID});
    }

    isShowUndoButton(lastStockItemDeleted){
        if (lastStockItemDeleted)
            return <ButtonContainer>
                    <Button onClick={() => this.onUndoDelete(lastStockItemDeleted)} isLoading={this.state.loading} name="Undo" isPrimary={true} />
                </ButtonContainer>;
        else 
            return null;
    }

    render() {
        if (this.state.loading && this.state.stockItems.length === 0){
            return <div>Loading...</div>;
        }
        else {
            return <div className="container">
                    <ButtonContainer>
                        <Button onClick={() => this.setState( {add: true } )} isLoading={this.state.loading} name="Add" isPrimary={true} />
                        <Button onClick={() => this.setState( {upload: true } )} isLoading={this.state.loading} name="Upload" isPrimary={true} />
                    </ButtonContainer>
                    <TableLight columnDetails={this.state.columnDetails} stockItems={this.state.stockItems} isLoading={this.state.loading}
                                mobileShowDeleteButtonRowID={this.state.mobileShowDeleteButtonRowID} showMobileDeleteButton={this.showMobileDeleteButton} />
                    <ModalForm name="Edit" columnDetails={this.state.columnDetails.filter(column => column.isDBField)} stockItem={this.state.editStockItem} show={this.state.edit} onClose={this.onModalClose}
                               onSubmit={this.onEditSubmit} />
                    <ModalForm name="Add" columnDetails={this.state.columnDetails.filter(column => column.isDBField)} show={this.state.add} onClose={this.onModalClose} onSubmit={this.onAddSubmit} />
                    <ModalForm name="Upload" columnDetails={this.state.uploadColumnDetails} show={this.state.upload} onClose={this.onModalClose} onSubmit={this.onUploadSubmit} />
                    <ModalForm name="Multi Add" columnDetails={this.state.columnDetails.filter(column => column.isDBField)} show={this.state.multiAdd} onClose={this.onModalClose} 
                                onSubmit={this.onMultiAddSubmit} stockItems={this.state.multiAddStockItems} setMultiAddStockItems={this.setMultiAddStockItems} />
                    {this.isShowUndoButton(this.state.lastStockItemDeleted)}
                </div>;
        }
    }
    
    onDelete(stockItem){        
        this.callFetch('delete', stockItem.id, true);
        this.setState({lastStockItemDeleted: stockItem});
        setTimeout(() => this.setState({lastStockItemDeleted: null}), 3000)
    }

    onUndoDelete(stockItem){
        this.callFetch('create', stockItem, true);
        this.setState({lastStockItemDeleted: null});
    }

    async populateStockData() {
        this.callFetch('index');
    }

    async callFetch(method, value, isSendAsJSON, stateValueToSet = 'stockItems') {
        this.setState({ stockItems: this.state.stockItems, loading: true });

        let requestContents = {};

        if(value) {
            if (isSendAsJSON) {
                requestContents = {
                    method: 'post',
                    headers: {
                        "Content-type": "application/json"
                    },
                    body: JSON.stringify(value)
                }
            }
            else {
                requestContents = {
                    method: 'post',
                    body: value
                }
            }
        }

        let response = await fetch('stockitem/' + method, requestContents)
          .catch(error => console.error('Error:', error));
        
        const data = await response.json();
        let bluch = { loading: false };
        bluch[stateValueToSet] = data;
        this.setState(bluch);
    }
}