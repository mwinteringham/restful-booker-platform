import React, { useEffect, useState } from 'react';
import { Route } from 'react-router-dom'
import Cookies from 'universal-cookie';

import Nav from './Nav.js';
import Login from './Login.js'
import Report from './Report.js';
import Branding from './Branding.js';
import MessageList from './MessageList.js';
import RoomListings from './RoomListings.js';
import RoomDetails from './RoomDetails.js';

import { API } from '../libs/Api.js';

const AdminContainer = () => {

    const [isAuthenticated, setAuthenticate] = useState(false);
    const [count, updateCount] = useState(0);

    useEffect(() => {
        const cookies = new Cookies();

        API.postValidation(setAuthenticate, cookies);
    }, []);
    
    const setCount = () => {
        API.getNotificationCount(updateCount);
    }
    
    return(<div>
        <Nav setAuthenticate={setAuthenticate} isAuthenticated={isAuthenticated} setCount={setCount} count={count} />
        <div className="container">
            <div>
                {isAuthenticated ? (
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
                                <MessageList setCount={setCount} />
                            </div>
                        )} />
                    </div>
                ) : (
                    <div>
                        <Login setAuthenticate={setAuthenticate} />
                    </div>
                )}
            </div>
        </div>
    </div>)

}

export default AdminContainer;
