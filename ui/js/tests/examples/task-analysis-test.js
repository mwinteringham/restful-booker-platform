import React from 'react';
import Login from '../../src/js/components/Login.jsx';
import nock from 'nock';

// We first declare our test by using Jests test function and provide it
// with a name and then an anonymous function which will run our test
test('Login component is created', () => {
    // Next we create our component that we want to check. By using
    // enzymes shallow function and passing it the React component
    // we want to create, Enzyme will create a headless DOM and render
    // the React component inside.
    const loginForm = shallow(<Login />);

    // We then compare what the component has done to a previously saved
    // state that lives in the __snapshots__ folder. If anything has changed
    // it will raise an alert.
    expect(loginForm).toMatchSnapshot();
});

// We first declare our test by using Jests test function and provide it
// with a name and then an anonymous function which will run our test
test('Login component sends correct payload', () => {
    // Our Login object is going to send an API request that we want to capture
    // and inspect to make sure the request body matches what we want. We do this
    // by programming a mock using nock with the expected URL and post body and 
    // finally create a fake response for it to reply with
    let authMock = nock('http://localhost:3004')
        .post('/auth/login', {
            "username" : "admin",
            "password" : "password"
        })
        .reply(200, { token: '123ABC' }, () => {
            done();
        });

    // Our component we want to test requires data so we create
    // our object of test data to use later
    const loginState = {
        "error" : false,
        "username" : "admin",
        "password" : "password"
    }

    // Next we create our component that we want to check. By using
    // enzymes shallow function and passing it the React component
    // we want to create, Enzyme will create a headless DOM and render
    // the React component inside.
    const login = shallow(<Login />)

    // Now that we have a rendered React component, we can call it's
    // internal functions. We call setState and pass it our data to 
    // update it's internal state. The component will then process that
    // data and do something with it.
    login.setState(loginState)

    // We next trigger one of the React's custom functions to trigger
    // the login process and send out the HTTP request.
    login.instance().doLogin();

    // Finally, we have to call isDone() on our mock to check whether
    // or not it received the expected request. If it did, it will return
    // true. If it didn't it will return false. We then assert whether 
    // the result is true.
    let didNockAcceptRequest = authMock.isDone();
    expect(didNockAcceptRequest).toBe(true)
})