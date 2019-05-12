import React from 'react';
import HotelContact from '../src/js/components/HotelContact.jsx';
import nock from 'Nock';

test('Contact form sends request to message API', (done) => {
    let messagePostMock = nock('http://localhost', {
                            name : 'Mark',
                            email : 'email@test.com',
                            phone : '018392391183',
                            subject : 'I want to book a room',
                            description : 'And I want a bottle of wine with the booking',
                        })
                        .post('/message/')
                        .reply(200, () => {
                            done();
                        });

    const contactState = {
        name: "Shady Meadows B&B",
        address: "The Old Farmhouse, Shady Street, Newfordburyshire, NE1 410S",
        phone: "0123456789",
        email: "fake@fakeemail.com"
    }

    const hotelContactComponent = shallow(
        <HotelContact contactState={contactState} />
    )

    hotelContactComponent.setState({
        contact : {
            name : 'Mark',
            email : 'email@test.com',
            phone : '018392391183',
            subject : 'I want to book a room',
            description : 'And I want a bottle of wine with the booking'
        }
    });

    hotelContactComponent.update();
    hotelContactComponent.instance().submitForm();

    let didNockAcceptRequest = messagePostMock.isDone();
    expect(didNockAcceptRequest).toBe(true);
    expect(hotelContactComponent).toMatchSnapshot();
});