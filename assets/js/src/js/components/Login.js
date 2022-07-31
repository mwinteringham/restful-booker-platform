import React, { useState } from 'react';
import { API } from '../libs/Api.js';

const Login = ({setAuthenticate}) => {

    const [error, setError] = useState(false);
    const [login, setLogin] = useState({
        username : "",
        password : ""
    });

    const doLogin = () => {
        API.postLogin(login, setAuthenticate, setError);
    }

    const updateLogin = (event) => {
        login[event.id] = event.value;

        setLogin(prevState => ({
            ...prevState
        }));
    }

    let borderColor = "grey";

    if(error){
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
                        <input data-testid="username" type="text" style={{border : "1px solid " + borderColor}} className="form-control" id="username" placeholder="Username" onChange={e => updateLogin(e.target)}/>
                    </div>
                    <div className="form-group">
                        <input data-testid="password" type="password" style={{border : "1px solid " + borderColor}} className="form-control" id="password" placeholder="Password" onChange={e => updateLogin(e.target)} />
                    </div>
                    <button type="submit" data-testid="submit" id="doLogin" className="btn btn-primary float-right" onClick={doLogin}>Login</button>
                </div>
                <div className="col-sm-4"></div>
            </div>
        </div>)

}

export default Login;
