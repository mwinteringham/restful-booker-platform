import React from 'react';
import nock from 'nock';
import RoomBookingForm from '../src/js/components/RoomBookingForm';

test('Booking form sends call to message API', (done) => {
    nock('http://localhost', {
            bookingdates :	{
                checkin : '2019-05-24',
                checkout : '2019-05-25'
            },
            depositpaid	: false,
            firstname : 'Mark',
            lastname : 'Winteringham',
            roomid : 2,
            totalprice : 100
        })
        .post('/booking/')
        .reply(200);

    let messagePostMock = nock('http://localhost', {
                            name : 'Mark Winteringham',
                            email : 'email@test.com',
                            phone : '018392391183',
                            subject : 'You have a new booking',
                            description : 'A new booking has been made by Mark Winteringham on the following dates: 2019-01-01 to 2019-01-05',
                        })
                        .post('/message/')
                        .reply(200, () => {
                            done();
                        });

    let roomBookingFormComponent = shallow(<RoomBookingForm roomid={1} />);
    
    roomBookingFormComponent.setState({
        booking : {
            bookingdates :	{
                checkin : '2019-05-24',
                checkout : '2019-05-25'
            },
            depositpaid	: false,
            firstname : 'Mark',
            lastname : 'Winteringham',
            roomid : 2,
            totalprice : 100
        },
        contact : {
            email : 'email@test.com',
            phone : '018392391183',
            subject : 'You have a new booking'
        }
    });

    roomBookingFormComponent.update();
    roomBookingFormComponent.instance().submitForm();

    let didNockAcceptRequest = messagePostMock.isDone();
    expect(didNockAcceptRequest).toBe(true);
});

test('Booking form sends call to booking API', (done) => {
    nock('http://localhost', {
            name : 'Mark Winteringham',
            email : 'email@test.com',
            phone : '018392391183',
            subject : 'You have a new booking',
            description : 'A new booking has been made by Mark Winteringham on the following dates: 2019-01-01 to 2019-01-05',
        })
        .post('/message/')
        .reply(200);

    let bookingPostMock = nock('http://localhost', {
                            bookingdates :	{
                                checkin : '2019-05-24',
                                checkout : '2019-05-25'
                            },
                            depositpaid	: false,
                            firstname : 'Mark',
                            lastname : 'Winteringham',
                            roomid : 2,
                            totalprice : 100
                        })
                        .post('/booking/')
                        .reply(200, () => {
                            done();
                        });

    let roomBookingFormComponent = shallow(<RoomBookingForm roomid={2} />);
    
    roomBookingFormComponent.setState({
        booking : {
            bookingdates :	{
                checkin : '2019-05-24',
                checkout : '2019-05-25'
            },
            depositpaid	: false,
            firstname : 'Mark',
            lastname : 'Winteringham',
            roomid : 2,
            totalprice : 100
        }
    });

    roomBookingFormComponent.update();
    roomBookingFormComponent.instance().submitForm();

    let didNockAcceptRequest = bookingPostMock.isDone();
    expect(didNockAcceptRequest).toBe(true);
});