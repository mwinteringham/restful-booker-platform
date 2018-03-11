import React from 'react';
import HotelListings from '../src/js/components/HotelListings.jsx';

// We first declare our test by using Jests test function and provide it
// with a name and then an anonymous function which will run our test
test('Hotels list component', () => {
    // Our component we want to test requires data so we create
    // our object to pass later
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

    // Next we create our component that we want to check. By using
    // enzymes shallow function and passing it the React component
    // we want to create, Enzyme will create a headless DOM and render
    // the React component inside.
    const hotels = shallow(
        <HotelListings />
    );

    // Now that we have a rendered React component, we can call it's
    // internal functions. We call setState and pass it our data to 
    // update it's internal state. The component will then process that
    // data and do something with it.
    hotels.setState({hotels : [hotelPayload]});

    // We then compare what the component has done to a previously saved
    // state that lives in the __snapshots__ folder. If anything has changed
    // it will raise an alert.
    expect(hotels).toMatchSnapshot();
});

// Check suggestions...
//
// Check creation of components are consistent
// Check state changes in components that use isAuthorised
// Check BookingListings populates with BookingListing components