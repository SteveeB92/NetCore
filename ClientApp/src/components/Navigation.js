import React from 'react';
import NavigationItem from './NavigationItem';
import LocationSetting from '../LocationSetting';
import './css/Navigation.css';

export default class Navigation extends React.Component {
    constructor(props){  
        super(props);  
        this.setNavItemActive = this.setNavItemActive.bind(this);
        this.state = {
            navItems: [
                        {key: 1, name: "Home", to: "/", isActive: true},
                        {key: 2, name: "Stock", to: "/Stock", isActive: false}
                      ]
        };
    }

    componentDidMount() {
        this.setNavItemActive();
    }

    setNavItemActive(){
        let navItems = this.state.navItems;
        let location = LocationSetting;
        navItems.forEach(navItem => navItem.isActive = navItem.to === location.pathname);
        this.setState({navItems: navItems});
    }

    render() {
        return this.display();
    }
    
    display() {
        return <nav className="blogNav">
            {this.state.navItems.map(navItem =>
                <NavigationItem key={navItem.key} name={navItem.name} to={navItem.to} isActive={navItem.isActive} setNavItemActive={this.setNavItemActive}/>
            )}
        </nav>
    }
}
