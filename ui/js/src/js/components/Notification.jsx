import React from 'react';
import { API } from '../libs/Api.js';

let style = {
    color: 'white',
    borderRadius: '100%',
    backgroundColor: 'darkred',
    padding: '3px',
    fontWeight: 'bold',
    fontFamily : 'Arial',
    position: 'absolute',
    margin: '-5px 0px 0px -12px',
    fontSize : '0.8rem'
}

export default class Notification extends React.Component {

    constructor() {
        super();

        this.state = {
            count : 0
        }
    }

    componentDidMount() {
        API.getNotificationCount(this);
    }

    render() {
        let alertIcon;

        if(this.state.count > 0){
            alertIcon = <span className="nav-link"><i className="fa fa-inbox" style={{fontSize : "1.5rem"}}><span style={style}>{this.state.count}</span></i></span>
        } else {
            alertIcon = <span className="nav-link"><i className="fa fa-inbox" style={{fontSize : "1.5rem"}}></i></span>
        }
        return alertIcon;
    }
    
}