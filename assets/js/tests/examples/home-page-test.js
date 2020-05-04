import React from 'react';
import RoomListings from '../../src/js/components/RoomListings.jsx';
import nock from 'nock';

// Although this is not necessary for the test. We add a mock in for the API
// that the RoomListings component will load when ready.
nock('http://localhost')
    .get('/room/')
    .reply(200, {
        "rooms": [
          {
            "roomid": 1,
            "roomNumber": 2,
            "type": "Single",
            "accessible": true,
            "image": "string",
            "description": "string",
            "features": [
              "string"
            ],
            "roomPrice": 0
          }
        ]
      });

// We first declare our test by using Jests test function and provide it
// with a name and then an anonymous function which will run our test
test('Rooms list component', () => {
    // Our component we want to test requires data so we create
    // our object to pass later
    const roomPayload = {
        "roomid": 1,
        "roomNumber": 101,
        "type": "Single",
        "beds": 2,
        "accessible": true,
        "details": "WiFi, TV, Mini-bar"
    }

    // Next we create our component that we want to check. By using
    // enzymes shallow function and passing it the React component
    // we want to create, Enzyme will create a headless DOM and render
    // the React component inside.
    const rooms = shallow(
        <RoomListings />
    );

    // Now that we have a rendered React component, we can call it's
    // internal functions. We call setState and pass it our data to 
    // update it's internal state. The component will then process that
    // data and do something with it.
    rooms.setState({rooms : [roomPayload]});

    // We then compare what the component has done to a previously saved
    // state that lives in the __snapshots__ folder. If anything has changed
    // it will raise an alert.
    expect(rooms).toMatchSnapshot();
});

// Check suggestions...
//
// Check creation of components are consistent
// Check state changes in components that use isAuthorised
// Check BookingListings populates with BookingListing components