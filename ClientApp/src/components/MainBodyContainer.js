import React from 'react';
import './css/Container.css';
import Header from './Header';

export default class MainBodyContainer extends React.Component{
    render(){
        return(
            <div className="container">
                <Header title="Title" subTitle="Sub Title" />  
            </div>
        );
    };
}