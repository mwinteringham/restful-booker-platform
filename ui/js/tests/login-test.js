import React from 'react';
import Login from '../src/js/components/Login.jsx';
import nock from 'nock';

test('Login component sends correct payload', () => {
    let mockScope = nock('http://localhost:3004')
        .post('/auth/login', {
            "username" : "admin",
            "password" : "password"
        })
        .reply(200, { token: '123ABC' }, () => {
            done();
        });

    const loginState = {
        "error" : false,
        "username" : "admin",
        "password" : "password"
    }

    const login = shallow(<Login />)

    login.setState(loginState)
    login.instance().doLogin();

    let correctRequestSent = mockScope.isDone();
    expect(correctRequestSent).toBe(true)
})