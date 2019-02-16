import React from 'react';
import Branding from '../src/js/components/Branding.jsx';
import nock from 'nock';

test('Branding page renders', () => {
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

    const brandingComponent = mount(
        <Branding />
    )

    brandingComponent.setState(brandingData);
    brandingComponent.update();

    expect(brandingComponent).toMatchSnapshot();
});

test('Branding page has controlled form', (done) => {
    nock('http://localhost:3002')
        .get('/branding/')
        .reply(200, brandingData)

    const brandingData = {
        name: 'UPDATE',
        map: {
            latitude: 88,
            longitude: 11
        },
        logoUrl: 'url/update',
        description: 'Updated description',
        contact: {
            name: 'Another B&B',
            address: 'Somewhere else',
            phone: '9999999',
            email: 'another@fakeemail.com'
        }
    }
    
    let brandingPutMock = nock('http://localhost:3002')
        .put('/branding/', brandingData)
        .reply(200, () => {
            done();
        });

    const brandingComponent = shallow(
        <Branding />
    )

    brandingComponent.setState(brandingData);
    brandingComponent.update();
    brandingComponent.instance().doUpdate();

    let didNockAcceptRequest = brandingPutMock.isDone();
    expect(didNockAcceptRequest).toBe(true);
});