import React from 'react';
import { useState, useEffect } from 'react';

import HotelRoomInfo from './HotelRoomInfo.js';
import HotelMap from './HotelMap.js';
import HotelLogo from './HotelLogo.js';
import HotelContact from './HotelContact.js';

import { API } from '../libs/Api.js';

const Home = () => {

    const [rooms, setRooms] = useState([]);
    const [branding, setBranding] = useState({});

    useEffect(() => {
        API.getBranding(setBranding);
        API.getRoom(setRooms);
    }, []);
 
    return (
        <div>
            <div className="container-fluid">
                <div className="row">
                    <div className='col-sm-12 text-center'>
                        <HotelLogo logoDetails={branding.logoUrl} />
                    </div>
                </div>
                <div className="row hotel-description">
                    <div className='col-sm-1'></div>
                    <div className='col-sm-10'>
                        <p>{branding.description}</p>
                    </div>
                    <div className='col-sm-1'></div>
                </div>
                <div className="row room-header">
                    <div className='col-sm-1'></div>
                    <div className='col-sm-10'>
                        <h2>Rooms</h2>
                    </div>
                    <div className='col-sm-1'></div>
                </div>
                {rooms.map((roomDetails) => {
                    return <div key={roomDetails.roomid}><HotelRoomInfo roomDetails={roomDetails} /></div>
                })}
                    <HotelContact contactDetails={branding.contact} />
                <div className="row">
                    <div className='col-sm-12'>
                        <HotelMap name={branding.name} mapDetails={branding.map} />
                    </div>
                </div>
            </div>
        </div>
    );
}

export default Home;