import React from 'react';
import { BrowserRouter } from 'react-router-dom';
import RoomListings from '../../src/js/components/RoomListings.jsx';
import nock from 'nock';
import {
  findByText,
  render
} from '@testing-library/react'

// First, we add a mock in for the API that the RoomListings component will load when ready
const roomMock = nock('http://localhost')
                .get('/room/')
                .reply(200, {
                    "rooms": [
                      {
                        "roomid": 1,
                        "roomName": "202",
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

// We then declare our test by using Jests test function and provide it
// with a name and then an anonymous function which will run our test
test('Rooms list component', async () => {
    // Next we create our component that we want to check. By using
    // react testing libraries' render function and passing it 
    // the React component we want to create, RTL will create a
    // headless DOM and render the React component inside.
    const {asFragment, findByText} = render(
      <BrowserRouter>
        <RoomListings />
      </BrowserRouter>
    );

    await findByText("string")

    // We then compare what the component has done to a previously saved
    // state that lives in the __snapshots__ folder. If anything has changed
    // it will raise an alert.
    expect(asFragment()).toMatchSnapshot();
});

// Check suggestions...
//
// Check creation of components are consistent
// Check state changes in components that use isAuthorised
// Check BookingListings populates with BookingListing components