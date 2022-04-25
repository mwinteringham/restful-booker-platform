import React from 'react';
import Branding from '../src/js/components/Branding.jsx';
import nock from 'nock';
import ReactModal from 'react-modal';
import '@testing-library/jest-dom'
import {
    render,
    fireEvent
  } from '@testing-library/react'

const brandingData = {
    name: 'Shady Meadows B&B',
    map: {
        latitude: 52.6351204,
        longitude: 1.2733774
    },
    logoUrl: 'https://www.mwtestconsultancy.co.uk/img/rbp-logo.png',
    description: 'Welcome to Shady Meadows, a delightful Bed & Breakfast nestled in the hills on Newingtonfordburyshire. A place so beautiful you will never want to leave. All our rooms have comfortable beds and we provide breakfast from the locally sourced supermarket. It is a delightful place.',
    contact: {
        name: 'Shady Meadows B&B',
        address: 'The Old Farmhouse, Shady Street, Newfordburyshire, NE1 410S',
        phone: '0123456789',
        email: 'fake@fakeemail.com'
    }
}

nock('http://localhost')
    .persist()
    .get('/branding/')
    .reply(200, brandingData)

test('Branding page renders', async () => {
    const { asFragment, findByDisplayValue } = render(
        <Branding />
    )

    await findByDisplayValue("52.6351204")
    
    expect(asFragment()).toMatchSnapshot();
});

test('Branding page shows modal on success', (done) => {
    nock('http://localhost')
        .put('/branding/')
        .reply(202)

    ReactModal.setAppElement(document.createElement('div'));

    const {getByText, getByPlaceholderText} = render(
        <Branding />
    )

    fireEvent.change(getByPlaceholderText('Enter B&B name'), { target: { value: 'Updated Room' } });
    fireEvent.click(getByText('Submit'))

    setTimeout(() => {
        expect(getByText('Branding updated!')).toBeInTheDocument()
        done();
    }, 500)

});

test('Branding page shows errors', async () => {
    nock('http://localhost')
        .put('/branding/')
        .reply(400, {
            "fieldErrors": ["Phone should not be blank"]
        })

    const {getByText, findByText} = render(
        <Branding />
    )

    fireEvent.click(getByText('Submit'))
    await findByText('Phone should not be blank')

    expect(getByText('Phone should not be blank')).toBeInTheDocument()
});
