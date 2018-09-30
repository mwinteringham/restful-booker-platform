import React from 'react';
import Welcome from '../src/js/components/Welcome.jsx';
import App from '../src/js/components/App.jsx';
import nock from 'nock';

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

    expect(appComponent).toMatchSnapshot();
});

test('Welcome component doesnt appear after close', () => {
    const appComponent = shallow(
        <App />
    )

    appComponent.instance().setWelcome(false);

    expect(appComponent).toMatchSnapshot();
});

test('Clicking on close button closes modal', () => {
    const appComponent = mount(
        <App />
    )

    appComponent.find('Welcome').instance().setState({
        page : 4
    });

    appComponent.update();

    appComponent.find('#closeModal').simulate('click');

    expect(appComponent).toMatchSnapshot();
});