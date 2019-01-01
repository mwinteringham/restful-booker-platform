import React from 'react';
import Cookies from 'universal-cookie';
import { Link, withRouter } from 'react-router-dom';
import PropTypes from 'prop-types';
import { API_ROOT } from '../api-config';

class Nav extends React.Component {

    constructor() {
        super();
        this.state = {
          username : "",
		  password : "",
		}
		
		this.doLogout = this.doLogout.bind(this);
    }
	
	doLogout(){
		fetch(API_ROOT.auth + '/logout', {
			method: 'POST',
			headers: {
				'Accept': 'application/json',
				'Content-Type': 'application/json'
			},
			body : JSON.stringify(this.state)
		})
		.then(res => {
			if(res.status == 200){
				this.props.setAuthenticate(false);

				const cookies = new Cookies();
				cookies.remove('token');
			}
		})
	}

	render() {
    	return(
			<nav className="navbar navbar-default">
				<div className="container-fluid"> 
					<div className="navbar-header"> 
					<a className="navbar-brand" href="/">Shady Meadows - Booking Management</a> 
					</div>
					{this.props.isAuthenticated && (
						<ul className="nav navbar-nav"> 
							<li><Link to="/">Rooms</Link></li>
							<li><Link id="reportLink" to="/report">Report</Link></li>
							<li id="logout"><a href="#" id="logout" onClick={this.doLogout}>Logout</a></li>
						</ul> 
					)}
				</div> 
			</nav>
      );
    }
}

Nav.propTypes = {
	match: PropTypes.object.isRequired,
	location: PropTypes.object.isRequired,
	history: PropTypes.object.isRequired
}

export default withRouter(Nav);
