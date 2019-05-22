import React from 'react';
import { Link } from 'react-router-dom';

export default class Notification extends React.Component {

    constructor() {
        super();
    }

    componentDidMount() {
        this.props.setCount();
    }

    render() {
        let alertIcon;

        if(this.props.count > 0){
            alertIcon = <i className="fa fa-inbox" style={{fontSize : "1.5rem"}}><span className="notification">{this.props.count}</span></i>
        } else {
            alertIcon = <i className="fa fa-inbox" style={{fontSize : "1.5rem"}}></i>
        }
        
        return <Link className="nav-link" to="/admin/messages">{alertIcon}</Link>;
    }
    
}