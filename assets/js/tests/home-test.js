import React from 'react';
import Home from '../src/js/components/Home.jsx';
import HotelMap from '../src/js/components/HotelMap.jsx';
import HotelLogo from '../src/js/components/HotelLogo.jsx';
import HotelContact from '../src/js/components/HotelContact.jsx';
import HotelRoomInfo from '../src/js/components/HotelRoomInfo.jsx';
import nock from 'nock';

const homeState = {
    rooms : [{
        roomid: 1,
        roomNumber: 101,
        type: 'Standard Room',
        accessible: false,
        image : 'https://www.mwtestconsultancy.co.uk/img/room1.jpg',
        description: 'Aenean porttitor mauris sit amet lacinia molestie. In posuere accumsan aliquet. Maecenas sit amet nisl massa. Interdum et malesuada fames ac ante.',
        features: [
            'Internet/Wi-fi',
            'Jacuzzi Bathroom',
            'Air conditioning',
            'High Definition TV',
            'Mini-bar'
        ]
    },{
        roomid: 2,
        roomNumber: 102,
        type: 'Single',
        accessible: true,
        image: 'https://www.mwtestconsultancy.co.uk/img/room2.jpg',
        description: 'Aenean porttitor mauris sit amet lacinia molestie. In posuere accumsan aliquet. Maecenas sit amet nisl massa. Interdum et malesuada fames ac ante.',
        features: [
            'Internet/Wi-fi',
            'Air conditioning',
            'Mini-bar'
        ]
    }],
    name : 'Shady meadows B&B',
    map : {
        latitude : 52.6351204,
        longitude : 1.2733774
    },
    logoUrl : 'https://www.mwtestconsultancy.co.uk/img/rbp-logo.png',
    description : "Welcome to Shady Meadows, a delightful Bed & Breakfast nestled in the hills on Newfordburyshire. A place so beautiful you will never want to leave. All our rooms have comfortable beds and we provide breakfast from the locally sourced supermarket. It's a delightful place.",
    contact : {
        name : 'Shady Meadows B&B',
        address : 'The Old Farmhouse, Shady Street, Newfordburyshire, NE1 410S',
        phone : '0123456789',
        email : 'fake@fakeemail.com'
    }
}

nock('http://localhost')
    .get('/room/')
    .reply(200, homeState);

nock('http://localhost')
    .get('/branding/')
    .reply(200, {
        name: 'A new name',
        map: {
            latitude: 88.123,
            longitude: 11.123
        },
        logoUrl: 'https://www.mwtestconsultancy.co.uk/url/update.png',
        description: 'Updated description',
        contact: {
            name: 'Another B&B',
            address: 'Somewhere else',
            phone: '99999999999',
            email: 'another@fakeemail.com'
        }
    });

test('Home page renders', (done) => {
    const homeComponent = shallow(
        <Home />
    )

    setTimeout(() => {
        expect(homeComponent).toMatchSnapshot();
        done();
    }, 1000);
});

test('Room info for home page renders', () => {
    const roomDetails = {
        roomid: 1,
        roomNumber: 101,
        type: 'Standard Room',
        beds: 2,
        accessible: false,
        image : 'https://www.mwtestconsultancy.co.uk/img/room1.jpg',
        description: 'Aenean porttitor mauris sit amet lacinia molestie. In posuere accumsan aliquet. Maecenas sit amet nisl massa. Interdum et malesuada fames ac ante.',
        features: [
            'Internet/Wi-fi',
            'Jacuzzi Bathroom',
            'Air conditioning',
            'High Definition TV',
            'Mini-bar'
        ]
    }

    const hotelRoomInfoComponent = shallow(
        <HotelRoomInfo room={roomDetails} />
    )

    expect(hotelRoomInfoComponent).toMatchSnapshot();
});

test('Booking info for room renders when button selected', () => {
    const roomDetails = {
        roomid: 1,
        roomNumber: 101,
        type: 'Standard Room',
        beds: 2,
        accessible: false,
        image : 'https://www.mwtestconsultancy.co.uk/img/room1.jpg',
        description: 'Aenean porttitor mauris sit amet lacinia molestie. In posuere accumsan aliquet. Maecenas sit amet nisl massa. Interdum et malesuada fames ac ante.',
        features: [
            'Internet/Wi-fi',
            'Jacuzzi Bathroom',
            'Air conditioning',
            'High Definition TV',
            'Mini-bar'
        ]
    }

    const hotelRoomInfoComponent = shallow(
        <HotelRoomInfo room={roomDetails} />
    )

    hotelRoomInfoComponent.find('.openBooking').simulate('click');

    expect(hotelRoomInfoComponent).toMatchSnapshot();
});

test('Map for home page renders', () => {
    const mapDetails = {
        latitude : 52.6351204,
        longitude : 1.2733774
    }

    const mapComponent = shallow(
        <HotelMap name={'Shady Meadows'} mapDetails={mapDetails} />
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