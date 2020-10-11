import React from 'react';
import Cookies from 'universal-cookie';
import { API_ROOT } from '../api-config';
import fetch from 'isomorphic-fetch';

export default class Login extends React.Component {

    constructor() {
        super();

        this.doLogin = this.doLogin.bind(this);

        this.state = {
            error : false
        }
    }

    doLogin() {
        let date = new Date();
        date.setDate(date.getDate() + 1);

        fetch(API_ROOT + '/auth/login', {
            method: 'POST',
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json'
            },
            body : JSON.stringify({
                username: this.state.username,
                password: this.state.password,
            })
        })
        .then(res => res.json())
        .then(res => {
            if(typeof(res.token) !== 'undefined'){
                const cookies = new Cookies();
                cookies.set('token', res.token, { path: '/', expires: date, sameSite : 'strict'});

                this.props.setAuthenticate(true);
            } else {
                this.setState({ error : true });
            }
        })
        .catch(e => {
          console.log("Failed to authenticate");
          console.log(e);
        })
    }

    render(){   
        let borderColor = "grey";

        if(this.state.error){
            borderColor = "red";
        }

        return(<div style={{marginTop: "15%"}}>
                <div className="row">
                    <div className="col-sm-2"></div>
                    <div className="col-sm-8" style={{textAlign : "center"}}>
                        <h2 data-testid="login-header">Log into your account</h2>
                        <br />
                    </div>
                    <div className="col-sm-2"></div>
                </div>
                <div className="row">
                    <div className="col-sm-4"></div>
                    <div className="col-sm-4">
                        <div className="form-group">
                            <input data-testid="username" type="text" style={{border : "1px solid " + borderColor}} className="form-control" id="username" placeholder="Username" onChange={val => this.setState({username : val.target.value})}/>
                        </div>
                        <div className="form-group">
                            <input data-testid="password" type="password" style={{border : "1px solid " + borderColor}} className="form-control" id="password" placeholder="Password" onChange={val => this.setState({password : val.target.value})} />
                        </div>
                        <button type="submit" data-testid="submit" id="doLogin" className="btn btn-primary float-right" onClick={this.doLogin}>Login</button>
                    </div>
                    <div className="col-sm-4"></div>
                </div>
            </div>)
    }

}




