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
				<nav className="navbar navbar-expand-lg navbar-dark bg-dark">
					<a className="navbar-brand" href="/admin/">Shady Meadows - Booking Management</a>
					<button className="navbar-toggler" type="button" data-toggle="collapse" data-target="#navbarNav" aria-controls="navbarNav" aria-expanded="false" aria-label="Toggle navigation">
						<span className="navbar-toggler-icon"></span>
					</button>
					<div className="collapse navbar-collapse" id="navbarNav">
					{this.props.isAuthenticated && (
						<ul className="navbar-nav">
							<li className="nav-item">
								<Link className="nav-link" to="/admin/">Rooms</Link>
							</li>
							<li className="nav-item">
								<Link className="nav-link" to="/admin/report">Report</Link>
							</li>
							<li className="nav-item">
								<Link className="nav-link" to="/admin/branding">Branding</Link>
							</li>
							<li className="nav-item">
								<a className="nav-link" href="#/admin/" id="logout" onClick={this.doLogout}>Logout</a>
							</li>
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
