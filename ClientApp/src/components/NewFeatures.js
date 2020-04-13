import React from 'react';
import TableLight from './TableLight';

export default class NewFeatures extends React.Component {
    constructor(props) {
        super(props);
        this.onEdit = this.onEdit.bind(this);
        this.onDelete = this.onDelete.bind(this);
        this.state = { 
            columnDetails: [
                {key:1, caption: 'Product', fieldName: 'productName', isDBField: true},
                {key:2, caption: 'Quantity', fieldName: 'quantity', isDBField: true},
                {key:3, caption: 'Unit', fieldName: 'unit', isDBField: true},
                {key:4, caption: 'Purchased Date', fieldName: 'purchasedDTFormatted', isDBField: true},
                {key:5, caption: 'Edit', isEdit: true, onClick: this.onEdit},
                {key:6, caption: 'Delete', isDelete: true, onClick: this.onDelete}],
            stockItems: [], 
            loading: true 
        };
    }

    componentDidMount() {
        this.populateStockData();
    }

    onEdit(){

    }

    render() {
        return this.state.loading && this.state.stockItems.length === 0
            ? <div>Loading...</div> 
            : <TableLight columnDetails={this.state.columnDetails} stockItems={this.state.stockItems} isLoading={this.state.loading}/>;
    }
    
    onDelete(key){        
        this.callFetch('delete', key);
    }

    async populateStockData() {
        let stockItem = { ProductName: 'Product 2', Quantity: 5, Unit: 'Kgs', PurchasedDT: '2020-04-12T21:32:50.376993+01:00' }

        this.callFetch('create', stockItem);
    }

    async callFetch(method, value) {
        this.setState({ stockItems: this.state.stockItems, loading: true });

        let response = await fetch('stockitem/' + method, {
            method: 'post',
            headers: {
              "Content-type": "application/json"
            },
            body: JSON.stringify(value)
          })
          .catch(error => console.error('Error:', error));
        
        const data = await response.json();
        this.setState({ stockItems: data, loading: false });
    }
}