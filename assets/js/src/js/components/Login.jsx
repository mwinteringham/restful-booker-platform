import React from 'react';
import { API } from '../libs/Api.js';

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

        API.postLogin(this)
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




