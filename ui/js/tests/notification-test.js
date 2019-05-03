import React from 'react';
import Notification from '../src/js/components/Notification.jsx';
import nock from 'nock';
import { waitForState } from 'enzyme-async-helpers';

beforeEach(() => {
    nock('http://localhost')
        .get('/notification/count')
        .reply(200, {
                count : 34
            }
        );
});

test('Notification renders plain inbox when no unread notifications', () => {

    const notificationComponent = shallow(<Notification />);

    expect(notificationComponent).toMatchSnapshot();

});

test('Notification renders alert inbox when there are unread notifications', async () => {

    const notificationComponent = shallow(<Notification />);
    
    await waitForState(notificationComponent, state => state.count === 34);

    expect(notificationComponent).toMatchSnapshot();

});
