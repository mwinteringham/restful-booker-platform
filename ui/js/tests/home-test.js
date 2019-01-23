import React from 'react';
import Home from '../src/js/components/Home.jsx';
import RoomInfo from '../src/js/components/RoomInfo.jsx';
import HotelMap from '../src/js/components/HotelMap.jsx';
import HotelLogo from '../src/js/components/HotelLogo.jsx';
import HotelContact from '../src/js/components/HotelContact.jsx';

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
        },
        logo : {
            url : 'https://www.mwtestconsultancy.co.uk/img/rbp-logo.png'
        },
        description : "Welcome to Shady Meadows, a delightful Bed & Breakfast nestled in the hills on Newfordburyshire. A place so beautiful you will never want to leave. All our rooms have comfortable beds and we provide breakfast from the locally sourced supermarket. It's a delightful place.",
        contact : {
            name : 'Shady Meadows B&B',
            address : 'The Old Farmhouse, Shady Street, Newfordburyshire, NE1 410S',
            phone : '0123456789',
            email : 'fake@fakeemail.com'
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

test('Logo for home page renders', () => {
    const logoDetails = {
        url : 'https://www.mwtestconsultancy.co.uk/img/rbp-logo.png'
    }

    const logoComponent = shallow(
        <HotelLogo logoDetails={logoDetails} />
    )

    expect(logoComponent).toMatchSnapshot();
});

test('Logo for home page errors render', () => {
    const logoComponent = shallow(
        <HotelLogo />
    )

    expect(logoComponent).toMatchSnapshot();
});

test('Contact form for home page renders', () => {
    const contactDetails = {
        name : 'Shady Meadows B&B',
        address : 'The Old Farmhouse, Shady Street, Newfordburyshire, NE1 410S',
        phone : '0123456789',
        email : 'fake@fakeemail.com'
    }

    const contactComponent = shallow(
        <HotelContact contact={contactDetails} />
    )

    expect(contactComponent).toMatchSnapshot();
});

test('Contact form errors render', () => {
    const contactComponent = shallow(
        <HotelContact />
    )

    expect(contactComponent).toMatchSnapshot();
});