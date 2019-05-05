import React from 'react';
import Messages from '../src/js/components/Messages.jsx';
import nock from 'nock';
import { waitForState } from 'enzyme-async-helpers';

beforeAll(() => {
    nock('http://localhost')
        .persist()
        .get('/message')
        .reply(200, {
                messages : [
                    {
                        "name" : "Mark Winteringham",
                        "subject" : "Subject description here"
                    }, {
                        "name" : "James Dean",
                        "subject" : "Another description here"
                    }, {
                        "name" : "Janet Samson",
                        "subject" : "Lorem ipsum dolores est"
                    }
                ]
            }
        );
});

test('Renders the list of messages correctly', async () => {
    const messageComponent = shallow(<Messages />);

    await waitForState(messageComponent, state => state.messages.length === 3);

    expect(messageComponent).toMatchSnapshot();
});

test('Deletes message when selected to delete', (done) => {
    let messageDeleteMock = nock('http://localhost')
                                .delete('/message/1')
                                .reply(201, () => {
                                    done();
                                });

    const messageComponent = shallow(<Messages />);
    messageComponent.instance().deleteMessage(1);

    let didNockAcceptRequest = messageDeleteMock.isDone();
    expect(didNockAcceptRequest).toBe(true);
});