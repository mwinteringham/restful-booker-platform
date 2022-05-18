import React, { useEffect } from 'react';
import { Link } from 'react-router-dom';

const Notification = ({setCount, count}) => {

    useEffect(() => {
        setCount();
    }, [])


    let alertIcon;

    if(count > 0){
        alertIcon = <i className="fa fa-inbox" style={{fontSize : "1.5rem"}}><span className="notification">{count}</span></i>
    } else {
        alertIcon = <i className="fa fa-inbox" style={{fontSize : "1.5rem"}}></i>
    }
    
    return <Link className="nav-link" to="/admin/messages">{alertIcon}</Link>;
    
}

export default Notification;
