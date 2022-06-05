import React, { useEffect, useState } from 'react';
import { Route, Routes } from 'react-router-dom'
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
                        <Routes>
                            <Route exact path='/' element={<RoomListings />} />
                            <Route exact path='room/:id' element={<RoomDetails />} />
                            <Route exact path='report' element={<Report defaultDate={new Date()} />} />
                            <Route exact path='branding' element={<Branding />} />
                            <Route exact path='messages' element={<MessageList setCount={setCount} />}/>
                        </Routes>
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
