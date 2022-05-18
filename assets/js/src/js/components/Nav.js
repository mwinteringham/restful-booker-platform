import React from 'react';
import Cookies from 'universal-cookie';
import { Link, withRouter } from 'react-router-dom';
import PropTypes from 'prop-types';
import { API } from '../libs/Api';
import Notification from './Notification.js';

const Nav = ({setAuthenticate, isAuthenticated, setCount, count}) => {
	
	const doLogout = () => {
		const cookies = new Cookies();
		let token = cookies.get('token')

		API.postLogout(setAuthenticate, token);
	}

	return(
			<nav className="navbar navbar-expand-md navbar-dark bg-dark">
				<div className="navbar-collapse collapse w-100 order-1 order-md-0 dual-collapse2">
					{isAuthenticated && (
						<ul className="navbar-nav mr-auto">
								<li className="nav-item">
									<Link className="nav-link" to="/admin/">Rooms</Link>
								</li>
								<li className="nav-item">
									<Link className="nav-link" to="/admin/report" id="reportLink">Report</Link>
								</li>
								<li className="nav-item">
									<Link className="nav-link" to="/admin/branding" id="brandingLink">Branding</Link>
								</li>
						</ul>
					)}
				</div>
				<div className="mx-auto order-0">
						<a className="navbar-brand mx-auto" href="#">B&B Booking Management</a>
						<button className="navbar-toggler" type="button" data-toggle="collapse" data-target=".dual-collapse2">
								<span className="navbar-toggler-icon"></span>
						</button>
				</div>
				<div className="navbar-collapse collapse w-100 order-3 dual-collapse2">
					{isAuthenticated && (
						<ul className="navbar-nav ml-auto">
								<li className="nav-item">
									<Notification setCount={setCount} count={count} />
								</li>
								<li className="nav-item">
										<a className="nav-link" id="frontPageLink" href="/">Front Page</a>
								</li>
								<li className="nav-item">
										<a className="nav-link" href="#/admin" onClick={doLogout}>Logout</a>
								</li>
						</ul>
					)}
				</div>
		</nav>
	);
}

Nav.propTypes = {
	match: PropTypes.object.isRequired,
	location: PropTypes.object.isRequired,
	history: PropTypes.object.isRequired
}

export default withRouter(Nav);
