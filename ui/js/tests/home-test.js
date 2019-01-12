import React from 'react';
import Home from '../src/js/components/home/Home.jsx';
import RoomInfo from '../src/js/components/home/RoomInfo.jsx';
import HotelMap from '../src/js/components/home/HotelMap.jsx';

test('Home page renders', () => {
    const homeState = {
        rooms : [{
            roomid: 1,
            roomNumber: 101,
            type: "Twin",
            beds: 2,
            accessible: false,
            details: "Wifi, TV, Mini-bar"
        },{
            roomid: 2,
            roomNumber: 102,
            type: "Single",
            beds: 1,
            accessible: true,
            details: "Walk in shower"
        }],
        map : {
            hotelName : 'Shady meadows B&B',
            latitude : 52.6351204,
            longitude : 1.2733774
        }
    }

    const homeComponent = shallow(
        <Home />
    )

    homeComponent.setState(homeState);
    homeComponent.update();

    expect(homeComponent).toMatchSnapshot();
});

test('Room info for home page renders', () => {
    const roomDetails = {
        roomid: 1,
        roomNumber: 101,
        type: "Twin",
        beds: 2,
        accessible: false,
        details: "Wifi, TV, Mini-bar"
    }

    const roomInfoComponent = shallow(
        <RoomInfo room={roomDetails} />
    )

    expect(roomInfoComponent).toMatchSnapshot();
});

test('Map for home page renders', () => {
    const mapDetails = {
        hotelName : 'Shady Meadows',
        latitude : 52.6351204,
        longitude : 1.2733774
    }

    const mapComponent = shallow(
        <HotelMap mapDetails={mapDetails} />
    )

    expect(mapComponent).toMatchSnapshot();
});

test('Map for home page renders error', () => {
    const mapComponent = shallow(
        <HotelMap />
    )

    expect(mapComponent).toMatchSnapshot();
});