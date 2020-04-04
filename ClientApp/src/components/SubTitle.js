import React from 'react';
import './css/SubTitle.css';
import './css/Lead.css';

export default class SubTitle extends React.Component{
    constructor(props){
        super(props);
        this.state = {name: props.name};
    }
    render(){
        return(
            <div className="subTitle,lead">{this.state.name}</div>
        );
    }
}