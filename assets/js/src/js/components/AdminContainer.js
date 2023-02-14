import React, { useEffect, useState } from 'react';
import { Route, Routes } from 'react-router-dom'
import Cookies from 'universal-cookie';

import Nav from './Nav.js';
import Login from './Login.js';
const Report = React.lazy(() => import('./Report.js'));
const Branding = React.lazy(() => import('./Branding.js'));
const MessageList = React.lazy(() => import('./MessageList.js'));
const RoomListings = React.lazy(() => import('./RoomListings.js'));
const RoomDetails = React.lazy(() => import('./RoomDetails.js'));

import Loading from './Loading.js';

import { API } from '../libs/Api.js';

const AdminContainer = () => {

    const [isAuthenticated, setAuthenticate] = useState(null);
    const [count, updateCount] = useState(0);

    useEffect(() => {
        const cookies = new Cookies();

        API.postValidation(setAuthenticate, cookies);
    }, []);
    
    const setCount = () => {
        API.getNotificationCount(updateCount);
    }

    if(isAuthenticated == null){
        return(
            <div>
                <Nav setAuthenticate={setAuthenticate} isAuthenticated={isAuthenticated} setCount={setCount} count={count} />
                <Loading />
            </div>
        )
    } else {
        return(
            <div>
                <Nav setAuthenticate={setAuthenticate} isAuthenticated={isAuthenticated} setCount={setCount} count={count} />
                <div className="container">
                    <div>
                        {isAuthenticated ? (
                            <div>
                                <Routes>
                                    <Route exact path='/' element={<React.Suspense fallback={<Loading />}><RoomListings /></React.Suspense>} />
                                    <Route exact path='room/:id' element={<React.Suspense fallback={<Loading />}><RoomDetails /></React.Suspense>} />
                                    <Route exact path='report' element={<React.Suspense fallback={<Loading />}><Report defaultDate={new Date()} /></React.Suspense>} />
                                    <Route exact path='branding' element={<React.Suspense fallback={<Loading />}><Branding /></React.Suspense>} />
                                    <Route exact path='messages' element={<React.Suspense fallback={<Loading />}><MessageList setCount={setCount} /></React.Suspense>}/>
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

}

export default AdminContainer;
