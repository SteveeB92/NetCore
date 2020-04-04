import React from 'react';
import Navigation from './Navigation';
import './css/Container.css'

export default class NavigationContainer extends React.Component {
    render() {
        return (
            <div className="container">
                <Navigation />
            </div>
        );
    }
}                