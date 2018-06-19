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
		  search : ""
		}
		
		this.doLogout = this.doLogout.bind(this);
		this.doSearch = this.doSearch.bind(this);
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

	doSearch(event){
		if(event.key == 'Enter'){
			document.getElementById("search").value = '';

			const { history } = this.props;
			
			if(history.location.pathname == '/search'){
				history.push({
					search: '?keyword=' + this.state.search
				})
			} else {
				history.push('/search?keyword=' + this.state.search)
			}
		}
	}

	render() {
    	return(
			<nav className="navbar navbar-default">
				<div className="container-fluid"> 
					<div className="navbar-header"> 
					<a className="navbar-brand" href="/">Hotel Management Platform</a> 
					</div> 
					<ul className="nav navbar-nav"> 
					<li><Link to="/">Home</Link></li>
					<li><Link to="/report">Report</Link></li> 
					<li id="logout"><a href="#" id="logout" onClick={this.doLogout}>Logout</a></li>
					<li><a href="#">Search:</a></li> 
					<li><input type="text" id="search" defaultValue={this.props.location.search.split('=')[1]} onKeyPress={this.doSearch} onChange={val => this.setState({search : val.target.value})}/></li> 
					</ul> 
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