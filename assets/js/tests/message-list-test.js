import React from 'react';
import MessageList from '../src/js/components/MessageList.jsx';
import nock from 'nock';

beforeAll(() => {
    nock('http://localhost')
        .persist()
        .get('/message/')
        .reply(200, {
                messages : [
                    {
                        "name" : "Mark Winteringham",
                        "subject" : "Subject description here",
                        "read" : true
                    }, {
                        "name" : "James Dean",
                        "subject" : "Another description here",
                        "read" : false
                    }, {
                        "name" : "Janet Samson",
                        "subject" : "Lorem ipsum dolores est",
                        "read" : true
                    }
                ]
            }
        );
});

test('Renders the list of messages correctly', async () => {
    const messageComponent = shallow(<MessageList setCount={() => {}} />);

    setTimeout(() => {
        expect(messageComponent).toMatchSnapshot();
    }, 1000);
});

test('Deletes message when selected to delete', (done) => {
    nock('http://localhost')
        .delete('/message/1')
        .reply(201, () => {
            done();
        });

    const messageComponent = shallow(<MessageList setCount={() => {}} />);
    messageComponent.instance().deleteMessage(1);
});

test('Clicking message shows message popup', async () => {
    const messageComponent = shallow(<MessageList setCount={() => {}} />);

    setTimeout(() => {
        messageComponent.find("#message0").simulate('click');
    }, 2000);

    expect(messageComponent).toMatchSnapshot();
});
