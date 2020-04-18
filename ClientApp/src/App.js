import React from 'react';
import { Route } from 'react-router';
import Masthead from './components/Masthead';
import Home from './components/Home';
import StockList from './components/StockList';

export default class App extends React.Component {
    render() {
        return (
            <div>
                <Masthead />
                <Route exact path='/' component={Home} />
                <Route path='/Stock' component={StockList} />
            </div>
        );
    }
}