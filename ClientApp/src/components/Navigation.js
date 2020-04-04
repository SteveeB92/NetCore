import React from 'react';
import NavigationItem from './NavigationItem';
import './css/Navigation.css';

export default class Navigation extends React.Component {
    render() {
        return (
            <nav className="blogNav">
                <NavigationItem isActive="1" name="Home" />
                <NavigationItem isActive="0" name="New Features" />
                <NavigationItem isActive="0" name="Press" />
                <NavigationItem isActive="0" name="New Hires" />
                <NavigationItem isActive="0" name="About" />
            </nav>
        );
    }
}                