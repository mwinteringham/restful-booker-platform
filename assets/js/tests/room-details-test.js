import React from 'react';
import RoomDetails from '../src/js/components/RoomDetails.js';
import nock from 'nock';

import {
    render, waitFor, fireEvent
  } from '@testing-library/react'

const roomObject = {
    roomid: 1,
    roomName: "101",
    type: "Single",
    accessible: true,
    image: "https://www.mwtestconsultancy.co.uk/img/testim/room2.jpg",
    description: "Aenean porttitor mauris sit amet lacinia molestie. In posuere accumsan aliquet. Maecenas sit amet nisl massa. Interdum et malesuada fames ac ante.",
    features: [
        "TV, WiFi, Safe"
    ],
    roomPrice: 100
}

nock('http://localhost')
    .persist()
    .get('/booking/?roomid=1')
    .reply(200, {})

test('Room details component renders', async () => {
    const roomMock = nock('http://localhost')
                        .get('/room/1')
                        .reply(200, roomObject);

    const {asFragment, getByText} = render(
        <RoomDetails params={{id : 1}} />
    )

    await waitFor(() => {expect(roomMock.isDone()).toBeTruthy()})
    await getByText(/Aenean/)
    
    expect(asFragment()).toMatchSnapshot();
});

test('Room details switches into edit mode', async () => {
    const roomMock = nock('http://localhost')
                        .get('/room/1')
                        .reply(200, roomObject);

    const {asFragment, getByText} = render(
        <RoomDetails params={{id : 1}} />
    )

    await waitFor(() => {expect(roomMock.isDone()).toBeTruthy()})
    
    fireEvent.click(getByText(/Edit/));

    await getByText(/Update/)

    expect(asFragment()).toMatchSnapshot();
});

test('Room details can be switched out of edit mode', async () => {
    const roomMock = nock('http://localhost')
                        .get('/room/1')
                        .reply(200, roomObject);

    const {asFragment, getByText} = render(
        <RoomDetails params={{id : 1}} />
    )

    await waitFor(() => {expect(roomMock.isDone()).toBeTruthy()})
    
    fireEvent.click(getByText(/Edit/));
    fireEvent.click(getByText(/Cancel/));

    expect(asFragment()).toMatchSnapshot();
});

test('Room details can render validation errors', async () => {
    const roomMock = nock('http://localhost')
                        .get('/room/1')
                        .reply(200, roomObject);

    const putMock = nock('http://localhost')
                        .put('/room/1')
                        .reply(400, {
                            "errorCode": 400,
                            "error": "BAD_REQUEST",
                            "errorMessage": "Validation failed for argument [0] in public org.springframework.http.ResponseEntity<com.automationintesting.model.db.Room> com.automationintesting.api.RoomController.updateRoom(com.automationintesting.model.db.Room,int,java.lang.String) throws java.sql.SQLException: [Field error in object 'room' on field 'type': rejected value [single]; codes [Pattern.room.type,Pattern.type,Pattern.java.lang.String,Pattern]; arguments [org.springframework.context.support.DefaultMessageSourceResolvable: codes [room.type,type]; arguments []; default message [type],[Ljavax.validation.constraints.Pattern$Flag;@21a98ac5,Single|Double|Twin|Family|Suite]; default message [Type can only contain the room options Single, Double, Twin, Family or Suite]] ",
                            "fieldErrors": ["Type can only contain the room options Single, Double, Twin, Family or Suite"]
                        });

    const {asFragment, getByText} = render(
        <RoomDetails params={{id : 1}} />
    )

    await waitFor(() => {expect(roomMock.isDone()).toBeTruthy()})

    fireEvent.click(getByText(/Edit/));
    fireEvent.click(getByText(/Update/));

    await waitFor(() => {expect(putMock.isDone()).toBeTruthy()})

    expect(asFragment()).toMatchSnapshot();
});

test('Room details can be submitted', async () => {
    const roomMock = nock('http://localhost')
                        .persist()
                        .get('/room/1')
                        .reply(200, roomObject);

    let putMock = nock('http://localhost')
                    .put('/room/1', {
                        "roomid": 1,
                        "roomName": "101",
                        "type": "Single",
                        "accessible": true,
                        "image": "https://www.mwtestconsultancy.co.uk/img/testim/room2.jpg",
                        "description": "Aenean porttitor mauris sit amet lacinia molestie. In posuere accumsan aliquet. Maecenas sit amet nisl massa. Interdum et malesuada fames ac ante.",
                        "features": ["TV, WiFi, Safe"],
                        "roomPrice": 100,
                        "featuresObject": {
                            "WiFi": false,
                            "TV": false,
                            "Radio": false,
                            "Refreshments": false,
                            "Safe": false,
                            "Views": false,
                            "TV, WiFi, Safe": true
                        }
                    })
                    .reply(202);
    
    const {getByText} = render(
        <RoomDetails params={{id : 1}} />
    )

    await waitFor(() => {expect(roomMock.isDone()).toBeTruthy()})

    fireEvent.click(getByText(/Edit/));
    fireEvent.click(getByText(/Update/));

    await waitFor(() => {expect(putMock.isDone()).toBeTruthy()})
});