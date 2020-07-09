import React from 'react';
import RoomDetails from '../src/js/components/RoomDetails.jsx';
import nock from 'nock';

nock('http://localhost')
    .persist()
    .get('/room/1')
    .reply(200, {
        roomid: 1,
        roomNumber: 101,
        type: "Single",
        accessible: true,
        image: "https://www.mwtestconsultancy.co.uk/img/testim/room2.jpg",
        description: "Aenean porttitor mauris sit amet lacinia molestie. In posuere accumsan aliquet. Maecenas sit amet nisl massa. Interdum et malesuada fames ac ante.",
        features: [
            "TV, WiFi, Safe"
        ],
        roomPrice: 100
    });

test('Room details component renders', () => {
    const roomDetailsComponent = shallow(
        <RoomDetails params={{id : 1}} />
    )

    expect(roomDetailsComponent).toMatchSnapshot();
});

test('Room details switches into edit mode', () => {
    const roomDetailsComponent = shallow(
        <RoomDetails params={{id : 1}} />
    )

    roomDetailsComponent.find('.room-details button').simulate('click');

    expect(roomDetailsComponent).toMatchSnapshot();
});

test('Room details can be switched out of edit mode', () => {
    const roomDetailsComponent = shallow(
        <RoomDetails params={{id : 1}} />
    )

    roomDetailsComponent.find('.room-details button').simulate('click');
    roomDetailsComponent.find('#cancelEdit').simulate('click');

    expect(roomDetailsComponent).toMatchSnapshot();
});

test('Room details can render validation errors', () => {
    nock('http://localhost')
        .put('/room/1')
        .reply(400, {
            "timestamp": "2020-05-02T21:54:40.530+0000",
            "status": 400,
            "error": "Bad Request",
            "errors": [{
                "codes": [
                    "Pattern.room.type",
                    "Pattern.type",
                    "Pattern.java.lang.String",
                    "Pattern"
                ],
                "arguments": [{
                        "codes": [
                            "room.type",
                            "type"
                        ],
                        "defaultMessage": "type",
                        "code": "type"
                    },
                    [],
                    {
                        "defaultMessage": "Single|Double|Twin|Family|Suite",
                        "codes": [
                            "Single|Double|Twin|Family|Suite"
                        ]
                    }
                ],
                "defaultMessage": "Type can only contain the room options Single, Double, Twin, Family or Suite",
                "objectName": "room",
                "field": "type",
                "rejectedValue": "string",
                "bindingFailure": false,
                "code": "Pattern"
            }],
            "message": "Validation failed for object='room'. Error count: 1",
            "path": "/room/1"
        });

    const roomDetailsComponent = shallow(
        <RoomDetails params={{id : 1}} />
    )

    roomDetailsComponent.find('.room-details button').simulate('click');
    roomDetailsComponent.find('#update').simulate('click');

    expect(roomDetailsComponent).toMatchSnapshot();
});

test('Room details can be submitted', () => {
    let putMock = nock('http://localhost')
                    .put('/room/1',  {
                        roomId : 1,
                        roomNumber : 999,
                        accessible : true,
                        image	: 'test/url',
                        description : 'Test description',
                        featuresObject : {
                            WiFi : false,
                            TV : false,
                            Radio : true,
                            Refreshments : true,
                            Safe : false,
                            Views : true
                        },
                        type: "Single",
                        features: ["Radio", "Refreshments", "Views"]
                    })
                    .reply(202, {});
    
    const roomDetailsComponent = shallow(
        <RoomDetails params={{id : 1}} />
    )
    
    roomDetailsComponent.setState({
        room : {
            roomId : 1,
            roomNumber : 999,
            accessible : true,
            image	: 'test/url',
            description : 'Test description',
            featuresObject : {
                WiFi : false,
                TV : false,
                Radio : true,
                Refreshments : true,
                Safe : false,
                Views : true
            },
            type : 'Single',
            features : []
        }
    });

    roomDetailsComponent.update();
    roomDetailsComponent.instance().doEdit();

    setImmediate(() => {
        let didNockAcceptRequest = putMock.isDone();
        expect(didNockAcceptRequest).toBe(true);
    });
});