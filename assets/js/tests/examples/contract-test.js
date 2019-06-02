import React from 'react';
import BookingListing from '../../src/js/components/BookingListing.jsx';
import contract from '../../../../booking/src/test/resources/contract.json';

// We first declare our test by using Jests test function and provide it
// with a name and then an anonymous function which will run our test
test('Rooms list component', () => {

    // First we create our component that we want to check. By using
    // enzymes shallow function and passing it the React component
    // we want to create, Enzyme will create a headless DOM and render
    // the React component inside. 
    //
    // You'll notice we are passing parameters to the component namely 
    // the contract we imported at the top of test. If the contract 
    // has been changed to make a different check pass we expect the 
    // check to fail and show what's changed.
    //
    // Also we pass isAuthenticated to put it into a mode where it 
    // renders as if we were logged in.
    const booking = shallow(
        <BookingListing booking={contract} isAuthenticated={true}/>
    );

    // We then compare what the component has done to a previously saved
    // state that lives in the __snapshots__ folder. If anything has changed
    // it will raise an alert.
    expect(booking).toMatchSnapshot();
});