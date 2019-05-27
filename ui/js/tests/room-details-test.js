import React from 'react';
import RoomDetails from '../src/js/components/RoomDetails.jsx';
import nock from 'nock';

beforeEach(() => {
    nock('http://localhost:3001')
        .get('/room/1')
        .reply(200, {
            roomid : 1,
            roomNumber : 101,
            type : 'single',
            accessible : false,
            description : 'This is a room to test',
            image : 'path/to/an/image',
            roomPrice : 100,
            features : {
                WiFi : false,
                TV : true,
                Radio : false,
                Refreshments : true,
                Safe : false,
                Views : true
            },       
        });
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
    const roomDetailsComponent = shallow(
        <RoomDetails params={{id : 1}} />
    )

    roomDetailsComponent.find('.room-details button').simulate('click');
    roomDetailsComponent.find('#update').simulate('click');

    expect(roomDetailsComponent).toMatchSnapshot();
});

test('Room details can be submitted', (done) => {
    let roomPutMock = nock('http://localhost', {
                            'accessible': true,
                            'description': 'Test description',
                            'features': ['Radio', 'Refreshments', 'Views'],
                            'image': 'test/url',
                            'roomNumber': 999,
                            'type': 'Single'
                        })
                        .put('/room/1')
                        .reply(201, () => {
                            done();
                        });
    
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
    })
    roomDetailsComponent.update();
    roomDetailsComponent.instance().doEdit();

    let didNockAcceptRequest = roomPutMock.isDone();
    expect(didNockAcceptRequest).toBe(true);
});