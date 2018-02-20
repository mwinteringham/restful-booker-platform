import React from "react";

export default class Nav extends React.Component {

    constructor() {
        super();
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
                  <p><label htmlFor="username">Username </label><input type="text" id="username" /></p> 
                  <p><label htmlFor="password">Password </label><input type="password" id="password" /></p> 
                </div> 
                <div className="modal-footer"> 
                  <button type="button" className="btn btn-default" id="doLogin">Login</button> 
                  <button type="button" className="btn btn-default" data-dismiss="modal">Close</button> 
                </div> 
              </div> 
            </div> 
          </div> 
        </nav>
      );
    }
  }