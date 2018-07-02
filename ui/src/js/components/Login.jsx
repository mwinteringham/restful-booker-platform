import React from 'react';
import Cookies from 'universal-cookie';

export default class Login extends React.Component {

    constructor() {
        super();

        this.doLogin = this.doLogin.bind(this);

        this.state = {
            error : false
        }
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
        .then(res => {
            if(res.status == 200){
                this.props.setAuthenticate(true);
          
                const cookies = new Cookies();
                cookies.set('token', res.json().token, { path: '/' });
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

        return(<div style={{marginTop: "20%"}}>
                <div className="row">
                    <div className="col-sm-2"></div>
                    <div className="col-sm-8" style={{textAlign : "center"}}>
                        <h2>Welcome to the Shady Meadows <br /> booking management system</h2>
                    </div>
                    <div className="col-sm-2"></div>
                </div>
                <div className="row">
                    <div className="col-sm-4"></div>
                    <div className="col-sm-4">
                        <p><label htmlFor="username">Username </label><input type="text" id="username" style={{border : "1px solid " + borderColor}} onChange={val => this.setState({username : val.target.value})}/></p> 
                    </div>
                    <div className="col-sm-4"></div>
                </div>
                <div className="row">
                    <div className="col-sm-4"></div>
                    <div className="col-sm-4">
                        <p><label htmlFor="password">Password </label><input type="password" id="password" style={{border : "1px solid " + borderColor}} onChange={val => this.setState({password : val.target.value})}/></p> 
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




