import React from 'react';
import nock from 'nock';
import LoginComponent from '../../src/js/components/Login.js';
import { render, fireEvent, waitFor } from '@testing-library/react';

jest.mock("react-ga")

// We first declare our test by using Jests test function and provide it
// with a name and then an anonymous function which will run our test
test('Login component is created', () => {
    // Next we create our component that we want to check. By using
    // React Testing Libraries' render function and passing it the React
    // component we want to create, RTL will create a headless DOM and 
    // render the React component inside.
    const { asFragment } = render(<LoginComponent />);

    // We then compare what the component has done to a previously saved
    // state that lives in the __snapshots__ folder. If anything has changed
    // it will raise an alert.
    expect(asFragment()).toMatchSnapshot();
});

// We first declare our test by using Jests test function and provide it
// with a name and then an anonymous function which will run our test
test('Login component sends correct payload', async () => {
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

    // Next we create our component that we want to check. By using
    // React Testing Libraries' render function and passing it the React
    // component we want to create, RTL will create a headless DOM and render
    // the React component inside.
    const {getByTestId} = render(
        <LoginComponent setAuthenticate={()=>{}} />,
    )

    // We next fill in the LoginComponent form fields and submit it
    fireEvent.change(getByTestId('username'), { target: { value: 'admin' } });
    fireEvent.change(getByTestId('password'), { target: { value: 'password' } });
    fireEvent.click(getByTestId('submit'));

    // Finally, we have to call isDone() on our mock to check whether
    // or not it received the expected request. If it did, it will return
    // true. If it didn't it will return false. We then assert whether 
    // the result is true.
    await waitFor(() => expect(authMock.isDone()).toBeTruthy())
});
