import React from 'react';
import { Route } from 'react-router-dom'
import { API_ROOT } from '../api-config';
import Cookies from 'universal-cookie';

import Nav from './Nav.jsx';
import Login from './Login.jsx'
import Report from './Report.jsx';
import Branding from './Branding.jsx';
import MessageList from './MessageList.jsx';

import RoomListings from './RoomListings.jsx';
import RoomDetails from './RoomDetails.jsx';

export default class AdminContainer extends React.Component {

    constructor(){
        super();

        this.state = {
            isAuthenticated : false,
        }
        
        this.setAuthenticate = this.setAuthenticate.bind(this);
    }

    componentDidMount(){
        const cookies = new Cookies();

        fetch(API_ROOT + '/auth/validate', {
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
    
    render(){
        return(<div>
            <Nav setAuthenticate={this.setAuthenticate} isAuthenticated={this.state.isAuthenticated} />
            <div className="container">
                <div>
                    {this.state.isAuthenticated ? (
                        <div>
                            <Route exact path='/admin/' render={(props) => (
                                <div>
                                    <RoomListings {...props} />
                                </div>
                            )} />
                            <Route exact path='/admin/room/:id' render={({ location, match }) => (
                                <div>
                                    <RoomDetails params={match.params}/>
                                </div>
                            )} />
                            <Route exact path='/admin/report' component={Report} />
                            <Route exact path='/admin/branding' component={Branding} />
                            <Route exact path='/admin/messages' component={MessageList} />
                        </div>
                    ) : (
                        <div>
                            <Login setAuthenticate={this.setAuthenticate} />
                        </div>
                    )}
                </div>
            </div>
        </div>)
    }

}