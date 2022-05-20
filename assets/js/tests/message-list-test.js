import React from 'react';
import MessageList from '../src/js/components/MessageList.js';
import nock from 'nock';

import '@testing-library/jest-dom'
import {
    render,
    waitFor,
    asFragment,
    fireEvent
  } from '@testing-library/react'

const messageMock = nock('http://localhost')
                        .persist()
                        .get('/message/')
                        .reply(200, {
                                messages : [
                                    {
                                        "id" : 1,
                                        "name" : "Mark Winteringham",
                                        "subject" : "Subject description here",
                                        "read" : true
                                    }, {
                                        "id" : 2,
                                        "name" : "James Dean",
                                        "subject" : "Another description here",
                                        "read" : false
                                    }, {
                                        "id" : 3,
                                        "name" : "Janet Samson",
                                        "subject" : "Lorem ipsum dolores est",
                                        "read" : true
                                    }
                                ]
                            });

test('Renders the list of messages correctly', async () => {
    const messageComponent = render(<MessageList setCount={() => {}} />);

    await waitFor(() => expect(messageMock.isDone()).toBeTruthy());
    await waitFor(() => expect(messageComponent).toMatchSnapshot());
});

test('Deletes message when selected to delete', async () => {
    const mock = nock('http://localhost')
                    .delete('/message/1')
                    .reply(201);

    const {getByTestId} = render(<MessageList setCount={() => {}} />);
    
    await waitFor(() => fireEvent.click(getByTestId(/DeleteMessage0/)))

    await waitFor(() => expect(mock.isDone()).toBeTruthy())
});

test('Clicking message shows message popup', async () => {
    nock('http://localhost')
        .put('/message/1/read')
        .reply(200)
    
    nock('http://localhost')
        .get('/message/1')
        .reply(200)

    const {asFragment, getByTestId} = render(<MessageList setCount={() => {}} />);

    await waitFor(() => { fireEvent.click(getByTestId(/message0/))});

    expect(asFragment()).toMatchSnapshot();
});
