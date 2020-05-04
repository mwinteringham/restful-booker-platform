import React from 'react';
import nock from 'nock';
import RoomBookingForm from '../src/js/components/RoomBookingForm';

nock('http://localhost')
    .get('/report/room/2')
    .reply(200, {});

test('Booking form sends call to booking API', (done) => {
    nock('http://localhost')
        .post('/booking/', {
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
        .reply(201, () => {
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
});
