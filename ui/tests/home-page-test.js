import React from 'react';
import HotelListings from '../src/js/components/HotelListings.jsx';

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
        <HotelListings />
    );

    hotels.setState({hotels : [hotelPayload]});

    expect(hotels).toMatchSnapshot();
});

// Check suggestions...
//
// Check creation of components are consistent
// Check state changes in components that use isAuthorised
// Check BookingListings populates with BookingListing components