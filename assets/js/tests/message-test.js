import React from 'react';
import Message from '../src/js/components/Message.jsx';
import nock from 'nock';
import '@testing-library/jest-dom'
import {
    render,
    waitFor,
    asFragment,
    getByText,
    screen
  } from '@testing-library/react'

nock('http://localhost')
    .persist()
    .get('/message/1')
    .reply(200, {
            "name" : "Mark Winteringham",
            "email" : "mark@mwtestconsultancy.co.uk",
            "phone" : "01821 912812",
            "subject" : "Subject description here",
            "description" : "Lorem ipsum dolores est"
        }
    );

nock('http://localhost')
    .persist()
    .put('/message/1/read')
    .reply(200);

test('Message popup is populated with details', async () => {
    render(<Message messageId={1} />);

    const modalComponent = screen.getByTestId(/message/);
    expect(modalComponent).toMatchSnapshot();
});