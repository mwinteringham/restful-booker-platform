import React from 'react';
import HotelContact from '../src/js/components/HotelContact.jsx';
import nock from 'nock';

test('Contact form sends request to message API', (done) => {
    let hotelContactComponent;
    nock('http://localhost')
        .post('/message/', {
            name : 'Mark',
            email : 'email@test.com',
            phone : '018392391183',
            subject : 'I want to book a room',
            description : 'And I want a bottle of wine with the booking',
        })
        .reply(200, () => {
            expect(hotelContactComponent).toMatchSnapshot();
            done();
        });

    hotelContactComponent = shallow(
        <HotelContact />
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
});