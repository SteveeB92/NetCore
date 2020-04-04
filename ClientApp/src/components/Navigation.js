import React from 'react';
import NavigationItem from './NavigationItem';
import './css/Navigation.css';

export default class Navigation extends React.Component {
    constructor(props){  
        super(props);  
        this.addActive = this.addActive.bind(this);
        this.state = {previousClick: "Home"};
    }

    addActive(name){
        this.setState({previousClick: name});
    }

    render() {

        return (
            <nav className="blogNav">
                <NavigationItem name="Home" to="/" previousClick={this.state.previousClick} addActive={this.addActive}/>
                <NavigationItem name="New Features" to="/NewFeatures" previousClick={this.state.previousClick} addActive={this.addActive}/>
                <NavigationItem name="Press" to="/" previousClick={this.state.previousClick} addActive={this.addActive}/>
                <NavigationItem name="New Hires" to="/" previousClick={this.state.previousClick} addActive={this.addActive}/>
                <NavigationItem name="About" to="/" previousClick={this.state.previousClick} addActive={this.addActive}/>
            </nav>
        );
    }
}