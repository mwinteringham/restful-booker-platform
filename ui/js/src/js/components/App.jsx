import React from 'react';
import { Route, Switch } from 'react-router-dom'
import RoomListings from './RoomListings.jsx';
import Search from './Search.jsx';
import Nav from './Nav.jsx';
import Login from './Login.jsx'
import RoomDetails from './RoomDetails.jsx';
import Report from './Report.jsx';
import Welcome from './Welcome.jsx';
import Cookies from 'universal-cookie';
import { API_ROOT } from '../api-config';

export default class App extends React.Component {

    constructor() {
        super();

        this.state = {
            isAuthenticated : false,
            showWelcome : true
        }
        
        this.setAuthenticate = this.setAuthenticate.bind(this);
        this.setWelcome = this.setWelcome.bind(this);
    }

    componentDidMount(){
        const cookies = new Cookies();

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
                    this.setState({isAuthenticated: true});
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
                    <Login setAuthenticate={this.setAuthenticate}/>
                 </div>
        } else {
            app = <div>
                    <Nav setAuthenticate={this.setAuthenticate} />
                    <Switch>
                        <Route exact path='/' render={(props) => <RoomListings {...props} />} />
                        <Route exact path='/search' component={Search} {...this.props}/>
                        <Route exact path='/room/:id' render={({ location, match }) => (
                            <RoomDetails isAuthenticated={this.state.isAuthenticated} params={match.params}/>
                        )} />
                        <Route exact path='/report' component={Report} />
                    </Switch>
                </div>
        }

        return(
            <div className="container">
                {welcome}
                {app}
            </div>
        );
    }
}
