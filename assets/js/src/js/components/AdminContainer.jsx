import React from 'react';
import { Route } from 'react-router-dom'
import Cookies from 'universal-cookie';
import moment from 'moment';

import Nav from './Nav.jsx';
import Login from './Login.jsx'
import Report from './Report.jsx';
import Branding from './Branding.jsx';
import MessageList from './MessageList.jsx';

import RoomListings from './RoomListings.jsx';
import RoomDetails from './RoomDetails.jsx';
import { API } from '../libs/Api.js';

export default class AdminContainer extends React.Component {

    constructor(){
        super();

        this.state = {
            isAuthenticated : false,
            count : 0
        }
        
        this.setAuthenticate = this.setAuthenticate.bind(this);
        this.setCount = this.setCount.bind(this);
    }

    componentDidMount(){
        const cookies = new Cookies();

        API.postValidation(this, cookies);
    }
    
    setAuthenticate(e){
        this.setState({
            isAuthenticated : e,
            showWelcome : this.state.showWelcome
        });
    }
    
    setCount(){
        API.getNotificationCount(this);
    }
    
    render(){
        return(<div>
            <Nav setAuthenticate={this.setAuthenticate} isAuthenticated={this.state.isAuthenticated} setCount={this.setCount} count={this.state.count} />
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
                            <Route exact path='/admin/report' render={() => (
                                <div>
                                    <Report defaultDate={new Date()} />
                                </div>
                            )} />
                            <Route exact path='/admin/branding' component={Branding} />
                            <Route exact path='/admin/messages' render={({ location, match }) => (
                                <div>
                                    <MessageList setCount={this.setCount} />
                                </div>
                            )} />
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