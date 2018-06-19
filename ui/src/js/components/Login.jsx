import React from 'react';
import Cookies from 'universal-cookie';
import { API_ROOT } from '../api-config';

export default class Login extends React.Component {

    constructor() {
        super();

        this.doLogin = this.doLogin.bind(this);
    }

    doLogin() {
        fetch(API_ROOT.auth + '/login', {
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

    render(){        
        return(<div style={{marginTop: "20%"}}>
                <div className="row">
                    <div className="col-sm-2"></div>
                    <div className="col-sm-8" style={{textAlign : "center"}}>
                        <h2>Welcome to Restful-booker-platform</h2>
                    </div>
                    <div className="col-sm-2"></div>
                </div>
                <div className="row">
                    <div className="col-sm-4"></div>
                    <div className="col-sm-4">
                        <p><label htmlFor="username">Username </label><input type="text" id="username" onChange={val => this.setState({username : val.target.value})}/></p> 
                    </div>
                    <div className="col-sm-4"></div>
                </div>
                <div className="row">
                    <div className="col-sm-4"></div>
                    <div className="col-sm-4">
                        <p><label htmlFor="password">Password </label><input type="password" id="password" onChange={val => this.setState({password : val.target.value})}/></p> 
                    </div>
                    <div className="col-sm-4"></div>
                </div>
                <div className="row">
                    <div className="col-sm-7"></div>
                    <div className="col-sm-1">
                        <button type="button" style={{marginLeft : "9px"}} className="btn btn-default" id="doLogin" data-dismiss="modal" onClick={this.doLogin}>Login</button>
                    </div>
                    <div className="col-sm-4"></div>
                </div>
            </div>)
    }

}




