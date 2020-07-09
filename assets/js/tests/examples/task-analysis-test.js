import React from 'react';
import nock from 'nock';
import LoginComponent from '../../src/js/components/Login.jsx';
import AppComponent from '../../src/js/components/App.jsx';

jest.mock("react-ga")

// We first declare our test by using Jests test function and provide it
// with a name and then an anonymous function which will run our test
test('Login component is created', () => {
    // Next we create our component that we want to check. By using
    // enzymes shallow function and passing it the React component
    // we want to create, Enzyme will create a headless DOM and render
    // the React component inside.
    const loginForm = shallow(<LoginComponent />);

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
    let authMock = nock('http://localhost')
        .post('/auth/login', {
            "username" : "admin",
            "password" : "password"
        })
        .reply(200, { token: '123ABC' });

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
    const login = shallow(<LoginComponent setAuthenticate={() => {}} />)

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

    setImmediate(() => {
        let didNockAcceptRequest = authMock.isDone();
        expect(didNockAcceptRequest).toBe(true)
    });
});

test('App is marked as logged in on successful request', (done) => {
    // Our Login object is going to make a call to an API to request
    // a token. So we are going to mock that API endpoint using nock to
    // return a specific token that we can then check for at a later date
    const authMock = nock('http://localhost')
        .post('/auth/login', {
            "username" : "admin",
            "password" : "password"
        })
        .reply(200, { token: '123ABC' });

    // We create a mocked function that the Login component fires after a
    // login. By mocking the function we can leverage it to assert whether
    // it was A. fired and B. sent the correct value.
    const mockedAuthenticate = (loggedInState) => {
        expect(loggedInState).toBe(true);
        done();
    }

    // Next we create the login component and add in the mocked function for
    // authentication that we hope will be triggered.
    const login = mount(<LoginComponent setAuthenticate={mockedAuthenticate} />)

    // Finally, we interact with the component. Filling in the form and submitting
    // it to trigger the login process. If everything goes to plan, the mocked function
    // will be triggered and the assertions will check the value
    login.find('#username').simulate('change', {target: {value: 'admin'}});
    login.find('#password').simulate('change', {target: {value: 'password'}});
    login.find('button').simulate('click')
});

// We first declare our test by using Jests test function and provide it
// with a name and then an anonymous function which will run our test
test('Correct components are rendered when logged in', () => {
    // First we create our component that we want to check. By using
    // enzymes shallow function and passing it the React component
    // we want to create, Enzyme will create a headless DOM and render
    // the React component inside.
    let application = shallow(<AppComponent />)

    // We then need to create the necessary state to set our application
    // component into to trigger the changes to the logged in state
    const applicationState = {
        isAuthenticated : true,
        showWelcome : false
    }

    // We update the application component with the application state we want
    // the component to be in and then trigger update to wake the component up
    // and observe the new state
    application.setState(applicationState);
    application.update();

    // We use setImmediate and an anonymous function to push the updating
    // of the component and the assertion to the end of the queue of function
    // calls within Node. This ensures that the AppComponent that is doing an
    // async call to a mock API has time to process the request and response
    // before we check it's state
    setImmediate(() => {
        expect(application).toMatchSnapshot();
    })
});