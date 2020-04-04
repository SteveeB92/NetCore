import React from 'react';
import Masthead from './components/Masthead';
import MainBodyContainer from './components/MainBodyContainer';

export default class App extends React.Component {
    render() {
        return (
            <div>
                <Masthead />
                <MainBodyContainer/>
            </div>
        );
    }
}