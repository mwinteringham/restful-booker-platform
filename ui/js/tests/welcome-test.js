import React from 'react';
import Welcome from '../src/js/components/Welcome.jsx';
import App from '../src/js/components/App.jsx';
import nock from 'nock';
import { mountWrap } from './helpers/routerWrapper.js';

beforeEach(() => {
    nock('http://localhost:3004')
        .post('/auth/validate')
        .reply(200);
});

test('Welcome component contains correct details', () => {
    const welcomeComponent = shallow(
        <Welcome />
    )

    expect(welcomeComponent).toMatchSnapshot();
});

test('Welcome component appears on initial visit', () => {
    const appComponent = shallow(
        <App />
    )

    appComponent.setState({
        showWelcome : true
    })

    expect(appComponent).toMatchSnapshot();
});

test('Welcome component doesnt appear after close', () => {
    const appComponent = shallow(
        <App />
    )

    appComponent.setState({
        showWelcome : false
    })

    expect(appComponent).toMatchSnapshot();
});
