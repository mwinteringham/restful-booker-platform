import React from "react";
import Cookies from 'universal-cookie';

export default class Nav extends React.Component {

    constructor() {
        super();
        this.state = {
          username : "",
          password : ""
        }
        this.doLogin = this.doLogin.bind(this);
    }

    doLogin() {
      fetch('http://localhost:3004/auth',{
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

    render() {
      return(
        <nav className="navbar navbar-default">
          <div className="container-fluid"> 
            <div className="navbar-header"> 
              <a className="navbar-brand" href="/">Hotel Management Platform</a> 
            </div> 
            <ul className="nav navbar-nav"> 
              <li><a href="/">Home</a></li> 
              <li><a href="#" data-toggle="modal" data-target="#myModal">Login</a></li>
              <li><a href="#">Search:</a></li> 
              <li><input type="text" id="search" /></li> 
            </ul> 
          </div> 
          <div id="myModal" className="modal fade" role="dialog"> 
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