import React from 'react';
import { Route } from 'react-router';
import Masthead from './components/Masthead';
import Home from './components/Home';
import NewFeatures from './components/NewFeatures';

export default class App extends React.Component {
    render() {
        return (
            <div>
                <Masthead />
                <Route exact path='/' component={Home} />
                <Route path='/NewFeatures' component={NewFeatures} />
            </div>
        );
    }
}