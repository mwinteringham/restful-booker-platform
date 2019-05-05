import React from 'react';
import { API } from '../libs/Api.js';
import { Link } from 'react-router-dom';

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
            alertIcon = <i className="fa fa-inbox" style={{fontSize : "1.5rem"}}><span className="notification">{this.state.count}</span></i>
        } else {
            alertIcon = <i className="fa fa-inbox" style={{fontSize : "1.5rem"}}></i>
        }
        
        return <Link className="nav-link" to="/admin/messages">{alertIcon}</Link>;
    }
    
}