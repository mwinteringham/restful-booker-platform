import React from 'react';
import Notification from '../src/js/components/Notification.jsx';

test('Notification renders plain inbox when no unread notifications', () => {

    const notificationComponent = shallow(<Notification setCount={() => {}} />);

    expect(notificationComponent).toMatchSnapshot();

});

test('Notification renders alert inbox when there are unread notifications', async () => {

    const notificationComponent = shallow(<Notification setCount={() => {}} count={34} />);

    expect(notificationComponent).toMatchSnapshot();

});
