import React from 'react';
import Home from '../src/js/components/Home.js';
import nock from 'nock';

import '@testing-library/jest-dom'
import {
    render,
    waitFor
  } from '@testing-library/react'

const homeState = {
    rooms : [{
        roomid: 1,
        roomName: "101",
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
        roomName: "102",
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

test('Home page renders', async () => {
    const {getByText, asFragment} = render(
        <Home />
    )

    await waitFor(() => expect(getByText(/Updated description/)).toBeInTheDocument());
    expect(asFragment()).toMatchSnapshot();
});
