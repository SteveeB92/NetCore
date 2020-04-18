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
        this.showMobileDeleteButton = this.showMobileDeleteButton.bind(this);
        this.state = { 
            columnDetails: [
                {key:1, caption: 'Product', fieldName: 'productName', isDBField: true, isDisplayField: true, dataType: "string", isMobile: true},
                {key:2, caption: 'Quantity', fieldName: 'quantity', isDBField: true, isDisplayField: true, displayFormat: 'quantity unit',
                    dataType: "number", isMobile: true},
                {key:3, caption: 'Unit', fieldName: 'unit', isDBField: true, isDisplayField: false, dataType: "string", isMobile: true},
                {key:4, caption: 'Purchased', fieldName: 'purchasedDT', fieldNameFormatted: 'purchasedDTFormatted', 
                    displayFormat: 'purchasedDTPretty', isDBField: true, isDisplayField: true, dataType: "date", isMobile: true},
                {key:5, caption: 'Edit', isDisplayField: true, isEdit: true, onClick: this.onEdit},
                {key:6, caption: 'Delete', isDisplayField: true, isDelete: true, onClick: this.onDelete}],
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
        this.setState({ edit: false, add: false, editStockItem: {} });
    }
    
    onEditSubmit(id){
        let newValues = { id: id };        
        this.getValuesFromModal(this.state.columnDetails, newValues);
        
        this.callFetch('edit', newValues);
        this.setState({ edit: false, editStockItem: {} });
    }
    
    onAddSubmit(){
        let newValues = { };
        this.getValuesFromModal(this.state.columnDetails, newValues);
        
        this.callFetch('create', newValues);
        this.setState({ add: false });
    }
    
    getValuesFromModal(columnDetails, stockItem){
        columnDetails.filter(column => column.isDBField).forEach(column => stockItem[column.fieldName] = $("#Input" + column.key).val());
        return stockItem;
    }

    showMobileDeleteButton(rowID){
        this.setState({mobileShowDeleteButtonRowID: rowID});
    }

    isShowUndoButton(lastStockItemDeleted){
        if (lastStockItemDeleted)
            return <ButtonContainer>
                    <Button onClick={() => this.onUndoDelete(lastStockItemDeleted)} isLoading={this.state.loading} name="Undo" isPrimary={true} />;
                </ButtonContainer>
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
                    </ButtonContainer>
                    <TableLight columnDetails={this.state.columnDetails} stockItems={this.state.stockItems} isLoading={this.state.loading}
                                mobileShowDeleteButtonRowID={this.state.mobileShowDeleteButtonRowID} showMobileDeleteButton={this.showMobileDeleteButton} />
                    <ModalForm name="Edit" columnDetails={this.state.columnDetails.filter(column => column.isDBField)} stockItem={this.state.editStockItem} show={this.state.edit} onClose={this.onModalClose}
                               onSubmit={this.onEditSubmit} />
                    <ModalForm name="Add" columnDetails={this.state.columnDetails.filter(column => column.isDBField)} show={this.state.add} onClose={this.onModalClose} onSubmit={this.onAddSubmit} />
                    {this.isShowUndoButton(this.state.lastStockItemDeleted)}
                </div>;
        }
    }
    
    onDelete(stockItem){        
        this.callFetch('delete', stockItem.id);
        this.setState({lastStockItemDeleted: stockItem});
        setTimeout(() => this.setState({lastStockItemDeleted: null}), 3000)
    }

    onUndoDelete(stockItem){
        this.callFetch('create', stockItem);
        this.setState({lastStockItemDeleted: null});
    }

    async populateStockData() {
        this.callFetch('index');
    }

    async callFetch(method, value) {
        this.setState({ stockItems: this.state.stockItems, loading: true });

        let requestContents = {};
            if(value) {
                requestContents = {
                method: 'post',
                headers: {
                    "Content-type": "application/json"
                },
                body: JSON.stringify(value)
            }
        };        

        let response = await fetch('stockitem/' + method, requestContents)
          .catch(error => console.error('Error:', error));
        
        const data = await response.json();
        this.setState({ stockItems: data, loading: false });
    }
}