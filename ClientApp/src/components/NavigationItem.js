import React from 'react';
import './css/NavigationItem.css'

export default class NavigationItem extends React.Component {
    constructor(props){
        super(props);
        this.state = {name: props.name, class: props.isActive === 1 ? "blog-nav-item active" : "blog-nav-item"};
    }

    render() {
        return (
            <a className="blogNavItem" href="#">{this.state.name}</a>
        );
    }

}