import React from 'react';
import Cookies from 'universal-cookie';
import { Link, withRouter } from 'react-router-dom';
import PropTypes from 'prop-types';

class Nav extends React.Component {

    constructor() {
        super();
        this.state = {
          username : "",
		  password : "",
		  search : ""
		}
		
		this.doLogin = this.doLogin.bind(this);
		this.doLogout = this.doLogout.bind(this);
		this.doSearch = this.doSearch.bind(this);
    }

    doLogin() {
      fetch('http://' + window.location.hostname + ':3004/auth', {
        method: 'POST',
        headers: {
        	'Accept': 'application/json',
			'Content-Type': 'application/json'
        },
        body : JSON.stringify(this.state)
      })
      .then(res=>res.json())
      .then(res => {
		this.props.setAuthenticate(true);
		
		const cookies = new Cookies();
		cookies.set('token', res.token, { path: '/' });
      })
      .catch(e => {
        console.log("Failed to authenticate");
        console.log(e);
      })
	}
	
	doLogout(){
		fetch('http://' + window.location.hostname + ':3004/logout', {
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
		let loginState = null;
		if(this.props.isAuthenticated){
			loginState = <li id="logout"><a href="#" id="logout" onClick={this.doLogout}>Logout</a></li>
		} else {
			loginState = <li id="login"><a href="#" data-toggle="modal" data-target="#loginModal">Login</a></li>
		}

    	return(
			<nav className="navbar navbar-default">
				<div className="container-fluid"> 
					<div className="navbar-header"> 
					<a className="navbar-brand" href="/">Hotel Management Platform</a> 
					</div> 
					<ul className="nav navbar-nav"> 
					<li><Link to="/">Home</Link></li>
					<li><Link to="/report">Report</Link></li> 
					{loginState}
					<li><a href="#">Search:</a></li> 
					<li><input type="text" id="search" defaultValue={this.props.location.search.split('=')[1]} onKeyPress={this.doSearch} onChange={val => this.setState({search : val.target.value})}/></li> 
					</ul> 
				</div> 
				<div id="loginModal" className="modal fade" role="dialog">
					<div className="modal-dialog"> 
					<div className="modal-content"> 
						<div className="modal-header"> 
						<button type="button" className="close" data-dismiss="modal">&times;</button> 
						<h4 className="modal-title">Login</h4> 
						</div> 
						<div className="modal-body"> 
						<p><label htmlFor="username">Username </label><input type="text" id="username" onChange={val => this.setState({username : val.target.value})}/></p> 
						<p><label htmlFor="password">Password </label><input type="password" id="password" onChange={val => this.setState({password : val.target.value})}/></p> 
						</div> 
						<div className="modal-footer"> 
						<button type="button" className="btn btn-default" id="doLogin" data-dismiss="modal" onClick={this.doLogin}>Login</button> 
						<button type="button" className="btn btn-default" data-dismiss="modal">Close</button> 
						</div> 
					</div> 
					</div> 
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