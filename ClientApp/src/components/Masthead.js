import React from 'react';
import NavigationContainer from './NavigationContainer';
import './css/Masthead.css';

export default class Masthead extends React.Component {
    render() {
        return (
            <div className="masthead">
                <NavigationContainer />
            </div>
        );
    }
}