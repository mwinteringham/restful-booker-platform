import React from 'react';
import { Route, Switch, withRouter } from 'react-router-dom'
import RoomListings from './RoomListings.jsx';
import Search from './Search.jsx';
import Nav from './Nav.jsx';
import Login from './Login.jsx'
import RoomDetails from './RoomDetails.jsx';
import Report from './Report.jsx';
import Welcome from './Welcome.jsx';
import Cookies from 'universal-cookie';
import { API_ROOT, SHOW_WELCOME } from '../api-config';
import CookiePolicy from './CookiePolicy.jsx';
import PrivacyPolicy from './PrivacyPolicy.jsx';

export default class App extends React.Component {

    constructor() {
        super();

        this.state = {
            isAuthenticated : false,
            showWelcome : false
        }
        
        this.setAuthenticate = this.setAuthenticate.bind(this);
        this.setWelcome = this.setWelcome.bind(this);
    }

    componentDidMount(){
        const cookies = new Cookies();

        if(typeof cookies.get('welcome') === 'undefined' && SHOW_WELCOME){
           this.setState({
                isAuthenticated : this.state.isAuthenticated,
                showWelcome : true
            })
        }

        fetch(API_ROOT.auth + '/validate', {
                method: 'POST',
                headers: {
                    'Accept': 'application/json',
                    'Content-Type': 'application/json'
                },
                body : JSON.stringify({ token: cookies.get('token')})
            })
            .then(res => {
                if(res.status == 200){
                    this.setAuthenticate(true);
                }
            })
    }

    setAuthenticate(e){
        this.setState({
            isAuthenticated : e,
            showWelcome : this.state.showWelcome
        });
    }

    setWelcome(e){
        this.setState({
            isAuthenticated : this.state.isAuthenticated,
            showWelcome : e
        });
    }

    render() {
        let app = null;
        let welcome = null;

        if(this.state.showWelcome){
            welcome = <div>
                <Welcome setWelcome={this.setWelcome} />
            </div>
        }

        if(!this.state.isAuthenticated){
            app = <div>
                    <Switch>
                        <Route exact path='/' render={() => <Login setAuthenticate={this.setAuthenticate} />} />
                        <Route exact path='/cookie' component={CookiePolicy} />
                        <Route exact path='/privacy' component={PrivacyPolicy} />
                    </Switch>
                 </div>
        } else {
            app = <div>
                    <Switch>
                        <Route exact path='/' render={(props) => <RoomListings {...props} />} />
                        <Route exact path='/search' component={Search} {...this.props}/>
                        <Route exact path='/room/:id' render={({ location, match }) => (
                            <RoomDetails isAuthenticated={this.state.isAuthenticated} params={match.params}/>
                        )} />
                        <Route exact path='/report' component={Report} />
                        <Route exact path='/cookie' component={CookiePolicy} />
                        <Route exact path='/privacy' component={PrivacyPolicy} />
                    </Switch>
                </div>
        }

        return(
            <div className="container">
                <Nav setAuthenticate={this.setAuthenticate} isAuthenticated={this.state.isAuthenticated} />               
                {welcome}
                {app}
            </div>
        );
    }
}