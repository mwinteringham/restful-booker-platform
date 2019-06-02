import React from 'react';
import nock from 'nock';
import RoomBookingForm from '../src/js/components/RoomBookingForm';

test('Booking form sends call to booking API', (done) => {
    let bookingPostMock = nock('http://localhost', {
                            bookingdates :	{
                                checkin : '2019-05-24',
                                checkout : '2019-05-25'
                            },
                            depositpaid	: false,
                            firstname : 'Mark',
                            lastname : 'Winteringham',
                            roomid : 2,
                            totalprice : 100,
                            email : "mark@mwtestconsultancy.co.uk",
                            phone : "01239123123"
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
            totalprice : 100,
            email : "mark@mwtestconsultancy.co.uk",
            phone : "01239123123"
        }
    });

    roomBookingFormComponent.update();
    roomBookingFormComponent.instance().submitForm();

    let didNockAcceptRequest = bookingPostMock.isDone();
    expect(didNockAcceptRequest).toBe(true);
});