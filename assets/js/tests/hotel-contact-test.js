import React from 'react';
import HotelContact from '../src/js/components/HotelContact.js';
import nock from 'nock';

import '@testing-library/jest-dom'
import {
    render,
    fireEvent,
    waitFor,
  } from '@testing-library/react'


const message = {
    name : 'Mark',
    email : 'email@test.com',
    phone : '018392391183',
    subject : 'I want to book a room',
    description : 'And I want a bottle of wine with the booking',
}

const contactDetails = {
        name: 'Another B&B',
        address: 'Somewhere else',
        phone: '99999999999',
        email: 'another@fakeemail.com'
}

test('Contact form sends request to message API', async () => {
    const scope = nock('http://localhost')
                    .post('/message/', message)
                    .reply(201);

    const {getByPlaceholderText, getByText, getByTestId} = render(
        <HotelContact contactDetails={contactDetails} />
    )
 
    await waitFor(() => getByPlaceholderText(/Name/))
    fireEvent.change(getByTestId(/ContactName/), { target: { value: message.name } });
    fireEvent.change(getByTestId(/ContactEmail/), { target: { value: message.email } });
    fireEvent.change(getByTestId(/ContactPhone/), { target: { value: message.phone } });
    fireEvent.change(getByTestId(/ContactSubject/), { target: { value: message.subject } });
    fireEvent.change(getByTestId(/ContactDescription/), { target: { value: message.description } });
    await fireEvent.click(getByText("Submit"));

    await waitFor(() => expect(scope.isDone()).toBeTruthy());
});
