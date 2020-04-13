import React from 'react';
import './css/Header.css';
import PropTypes from "prop-types";
import TitleComp from './Title';
import SubTitle from './SubTitle';

export default class Header extends React.Component{
    constructor(props){
        super(props);
        this.state = {title: props.title, subTitle: props.subTitle};
    }

    render()
    {
        return (
            <div className="header">
                <TitleComp name={this.state.title} />
                <SubTitle name={this.state.subTitle}/>
            </div>
        );
    }
}
Header.propTypes = {
    title: PropTypes.string.isRequired,
    subTitle: PropTypes.string.isRequired
};