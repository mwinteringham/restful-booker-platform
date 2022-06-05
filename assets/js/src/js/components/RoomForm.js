import React, { useState } from 'react';
import { API } from '../libs/Api.js';

const RoomForm = ({updateRooms}) => {

    const [errors, setErrors] = useState([]);
    const [rooms, setRooms] = useState([]);
    const [newRoom, setNewRoom] = useState({
        roomName : '',
        type : "Single",
        accessible : false,
        description : "Please enter a description for this room",
        image : 'https://www.mwtestconsultancy.co.uk/img/room1.jpg',
        roomPrice : '',
        features : {
            WiFi : false,
            TV : false,
            Radio : false,
            Refreshments : false,
            Safe : false,
            Views : false
        }
    });
    
    const resetForm = () => {
        setErrors([]);
        setRooms([]);
        setNewRoom({
            roomName : "",
            type : "Single",
            accessible : false,
            description : "Please enter a description for this room",
            image : 'https://www.mwtestconsultancy.co.uk/img/room1.jpg',
            roomPrice : '',
            features : {
                WiFi : false,
                TV : false,
                Radio : false,
                Refreshments : false,
                Safe : false,
                Views : false
            }
        });
    }

    const createRoom = () => {
        newRoom.features = Object.keys(newRoom.features).filter(key => newRoom.features[key]);
        
        API.postRoom(newRoom, resetForm, updateRooms, setErrors);
    }

    const updateState = (event) => {
        if(event.name === 'featureCheck'){
            newRoom.features[event.value] = event.checked;
        } else {
            newRoom[event.id] = event.value;
        }

        setNewRoom(prevState => ({
            ...prevState
        }));
    }
    
    let errorMessages = '';
    
    if(errors.length > 0){
        errorMessages = <div className="alert alert-danger" style={{marginBottom : 5 + "rem"}}>
            {errors.map((value) => {
                return <p key={value}>{value}</p>
            })}
        </div>
    }

    return <div>
                <div className="row room-form">
                    <div className="col-sm-1">
                        <input className="form-control" type="text" data-testid="roomName" id="roomName" value={newRoom.roomName} onChange={e => updateState(e.target)} />
                    </div>
                    <div className="col-sm-2">
                        <select className="form-control" id="type" value={newRoom.type} onChange={e => updateState(e.target)}>
                            <option value="Single">Single</option>
                            <option value="Twin">Twin</option>
                            <option value="Double">Double</option>
                            <option value="Family">Family</option>
                            <option value="Suite">Suite</option>
                        </select>
                    </div>
                    <div className="col-sm-2">
                        <select className="form-control" id="accessible" value={newRoom.accessible} onChange={e => updateState(e.target)}>
                            <option value="false">false</option>
                            <option value="true">true</option>
                        </select>
                    </div>
                    <div className="col-sm-1">
                        <input className="form-control" type="text" id="roomPrice" value={newRoom.roomPrice} onChange={e => updateState(e.target)} />
                    </div>
                    <div className="col-sm-5">
                        <div className="row">
                            <div className="col-4">
                                <div className="form-check form-check-inline">
                                    <input className="form-check-input" type="checkbox" name="featureCheck" id="wifiCheckbox" value="WiFi" checked={newRoom.features.wifi} onChange={e => updateState(e.target)} />
                                    <label className="form-check-label" htmlFor="wifiCheckbox">WiFi</label>
                                </div>
                            </div>
                            <div className="col-4">
                                <div className="form-check form-check-inline">
                                    <input className="form-check-input" type="checkbox" name="featureCheck" id="tvCheckbox" value="TV" checked={newRoom.features.tv} onChange={e => updateState(e.target)} />
                                    <label className="form-check-label" htmlFor="tvCheckbox">TV</label>
                                </div>
                            </div>
                            <div className="col-4">
                                <div className="form-check form-check-inline">
                                    <input className="form-check-input" type="checkbox" name="featureCheck" id="radioCheckbox" value="Radio" checked={newRoom.features.radio} onChange={e => updateState(e.target)} />
                                    <label className="form-check-label" htmlFor="radioCheckbox">Radio</label>
                                </div>
                            </div>
                        </div>
                        <div className="row">
                            <div className="col-4">
                                <div className="form-check form-check-inline">
                                    <input className="form-check-input" type="checkbox" name="featureCheck" id="refreshCheckbox" value="Refreshments" checked={newRoom.features.refreshments} onChange={e => updateState(e.target)} />
                                    <label className="form-check-label" htmlFor="refreshCheckbox">Refreshments</label>
                                </div>
                            </div>
                            <div className="col-4">
                                <div className="form-check form-check-inline">
                                    <input className="form-check-input" type="checkbox" name="featureCheck" id="safeCheckbox" value="Safe" checked={newRoom.features.safe} onChange={e => updateState(e.target)} />
                                    <label className="form-check-label" htmlFor="safeCheckbox">Safe</label>
                                </div>
                            </div>
                            <div className="col-4">
                                <div className="form-check form-check-inline">
                                    <input className="form-check-input" type="checkbox" name="featureCheck" id="viewsCheckbox" value="Views" checked={newRoom.features.views} onChange={e => updateState(e.target)} />
                                    <label className="form-check-label" htmlFor="viewsCheckbox">Views</label>
                                </div>
                            </div>
                        </div>
                    </div>
                    <div className="col-sm-1">
                        <button className="btn btn-outline-primary" id="createRoom" type="submit" onClick={createRoom}>Create</button>
                    </div>
                </div>
                {errorMessages}
            </div>

}

export default RoomForm;
