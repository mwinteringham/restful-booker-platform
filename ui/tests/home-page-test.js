import React from 'react';
import Hotels from '../src/js/components/Hotels.jsx';

test('Hotels list component', () => {
    const hotelPayload = {
        "hotelid": 1,
        "name": "Hilton",
        "address": "123 The Street",
        "regdate": "2018-02-20T22:47:38.176Z",
        "contact": {
            "name": "Mark Winteringham",
            "phone": "07411222473",
            "email": "mark@hilton.com"
        }
    }

    const hotels = shallow(
        <Hotels />
    );

    hotels.setState({hotels : [hotelPayload]});

    expect(hotels).toMatchSnapshot();
});