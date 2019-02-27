import React from 'react';
import HotelContact from '../src/js/components/HotelContact.jsx';

test('Contact form returns error messages', () => {
    const contactState = {
        name : "Mark",
        email : "mark@email.com",
        phone : "074123291234",
        subject : "I want cake",
        message : "This is my message for cake",
    }

    const hotelContactComponent = shallow(
        <HotelContact contact={contactState} />
    );

    hotelContactComponent.find('#submitContact').simulate('click');

    expect(hotelContactComponent).toMatchSnapshot();
});

test('Contact form can be submitted', () => {
    const contactState = {
        name: "Shady Meadows B&B",
        address: "The Old Farmhouse, Shady Street, Newfordburyshire, NE1 410S",
        phone: "0123456789",
        email: "fake@fakeemail.com"
    }

    const hotelContactComponent = shallow(
        <HotelContact contact={contactState} />
    );

    hotelContactComponent.setState({
        name : 'Mark',
        email : 'email@test.com',
        phone : '018392391183',
        subject : 'I want to book a room',
        message : 'And I want a bottle of wine with the booking',
    })
    hotelContactComponent.update();
    hotelContactComponent.find('#submitContact').simulate('click');

    expect(hotelContactComponent).toMatchSnapshot();
});