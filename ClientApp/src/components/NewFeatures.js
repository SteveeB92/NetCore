import React from 'react';
import TableLight from './TableLight';
import ModalForm from './ModalForm';
import $ from 'jquery';
import Button from './Button';

export default class NewFeatures extends React.Component {
    constructor(props) {
        super(props);
        this.onEdit = this.onEdit.bind(this);
        this.onDelete = this.onDelete.bind(this);
        this.onEditClose = this.onEditClose.bind(this);
        this.onEditSubmit = this.onEditSubmit.bind(this);
        this.onAddSubmit = this.onAddSubmit.bind(this);
        this.state = { 
            columnDetails: [
                {key:1, caption: 'Product', fieldName: 'productName', isDBField: true, dataType: "string"},
                {key:2, caption: 'Quantity', fieldName: 'quantity', isDBField: true, dataType: "number"},
                {key:3, caption: 'Unit', fieldName: 'unit', isDBField: true, dataType: "string"},
                {key:4, caption: 'Purchased Date', fieldName: 'purchasedDT', fieldNameFormatted: 'purchasedDTFormatted', fieldNamePretty: 'purchasedDTPretty', isDBField: true, dataType: "date"},
                {key:5, caption: 'Edit', isEdit: true, onClick: this.onEdit},
                {key:6, caption: 'Delete', isDelete: true, onClick: this.onDelete}],
            stockItems: [], 
            loading: true,
            edit: false,
            add: false,
            editStockItem: {}
        };
    }

    componentDidMount() {
        this.populateStockData();
    }

    onEdit(editStockItem){
        this.setState({ stockItems: this.state.stockItems, loading: false, edit: true, editStockItem: editStockItem });
    }

    onEditClose(){
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

    render() {
        if (this.state.loading && this.state.stockItems.length === 0){
            return <div>Loading...</div>;
        }
        else {
            return <>
                    <TableLight columnDetails={this.state.columnDetails} stockItems={this.state.stockItems} isLoading={this.state.loading}/>
                    <ModalForm name="Edit" columnDetails={this.state.columnDetails} stockItem={this.state.editStockItem} show={this.state.edit} onClose={this.onEditClose}
                                onSubmit={this.onEditSubmit} />
                    <ModalForm name="Add" columnDetails={this.state.columnDetails} show={this.state.add} onClose={this.onEditClose} onSubmit={this.onAddSubmit} />
                    <Button onClick={() => this.setState( {add: true } )} isLoading={this.state.loading} name="Add" isPrimary={true} />
                </>;
        }
    }
    
    onDelete(key){        
        this.callFetch('delete', key);
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