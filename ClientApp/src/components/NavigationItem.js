import React from 'react';
import './css/NavigationItem.css'

export default class NavigationItem extends React.Component {
    constructor(props){
        super(props);
        this.state = {name: props.name, class: props.isActive === "1" ? "blogNavItem active" : "blogNavItem"};
    }

    render() {
        return (
            <a className={this.state.class} href="#">{this.state.name}</a>
        );
    }
}