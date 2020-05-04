import React from 'react';
import Branding from '../src/js/components/Branding.jsx';
import nock from 'nock';
import ReactModal from 'react-modal';

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

const brandingUpdateData = {
    name: 'A new name',
    map: {
        latitude: 88.123,
        longitude: 11.123
    },
    logoUrl: 'https://www.mwtestconsultancy.co.uk/url/update.png',
    description: 'Updated description',
    contact: {
        name: 'Another B&B',
        address: 'Somewhere else',
        phone: '99999999999',
        email: 'another@fakeemail.com'
    }
}

nock('http://localhost')
    .persist()
    .get('/branding/')
    .reply(200, brandingData)

test('Branding page renders', async () => {
    const brandingComponent = mount(
        <Branding />
    )

    setTimeout(() => {
        expect(brandingComponent).toMatchSnapshot();
    }, 0);
});

test('Branding page has controlled form', (done) => {    
    nock('http://localhost')
        .put('/branding/', brandingUpdateData)
        .reply(200, () => {
            done();
        });

    const brandingComponent = shallow(
        <Branding />
    )

    brandingComponent.setState({ branding : brandingUpdateData});
    brandingComponent.update();
    brandingComponent.instance().doUpdate();
});

test('Branding page shows modal on success', () => {
    ReactModal.setAppElement(document.createElement('div'));

    const brandingComponent = mount(
        <Branding />
    )

    brandingComponent.setState({ showModal : true });

    expect(brandingComponent).toMatchSnapshot();
});

test('Branding page shows errors', () => {
    const brandingComponent = shallow(
        <Branding />
    )

    brandingComponent.setState({
        errors : ["Phone should not be null"]
    })
    brandingComponent.update();

    expect(brandingComponent).toMatchSnapshot();
});
