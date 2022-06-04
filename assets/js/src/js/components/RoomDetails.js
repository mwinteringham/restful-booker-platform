import React, { useEffect, useState } from 'react';
import BookingListings from './BookingListings.js';
import { useParams } from 'react-router-dom';
import { API } from '../libs/Api.js';

const RoomDetails = ({}) => {

    let { id } = useParams();
    const [edit, toggleEdit] = useState(false);
    const [room, setRoom] = useState({
        accessible : false,
        description : "",
        featuresObject : {
            WiFi : false,
            TV : false,
            Radio : false,
            Refreshments : false,
            Safe : false,
            Views : false
        },
        features : []
    });
    const [errors, setErrors] = useState([]);

    useEffect(() => {
        API.getRoomById(id, room, setRoom);
    }, [])

    const toggleAndRestEdit = (toggle) => {
        setErrors({});
        toggleEdit(toggle);
    }

    const doEdit = () => {
        room.features = Object.keys(room.featuresObject).filter(key => room.featuresObject[key]);

        API.putRoom(id, room, resetForm, fetchRoomDetails, setErrors);
    }

    const resetForm = () => {
        toggleEdit(false);
        setRoom({
            accessible : false,
            description : "",
            featuresObject : {
                WiFi : false,
                TV : false,
                Radio : false,
                Refreshments : false,
                Safe : false,
                Views : false
            },
            features : []
        });
        setErrors([]);
    }

    const fetchRoomDetails = () => {
        API.getRoomById(id, room, setRoom)
    }

    const updateState = (event) => {
        if(event.name === 'featureCheck'){
            room.featuresObject[event.value] = event.checked;
        } else {
            room[event.id] = event.value;
        }

        setRoom(prevState => ({
            ...prevState
        }));
    }

    let roomSummary = null;
    let errorMessages = '';
    
    if(errors.length > 0){
        errorMessages = <div className="alert alert-danger" style={{marginTop : 15 + "px"}}>
            {errors.map((value) => {
                return <p key={value}>{value}</p>
            })}
        </div>
    }

    if(edit == true){
        roomSummary =  <div className="room-details">
                            <div className="form-row">
                                <div className="col-sm-9">
                                    <h2>Room: </h2>
                                    <input type="text" defaultValue={room.roomName} id="roomName" onChange={e => updateState(e.target)} />
                                </div>
                                <div className="col-sm-3">
                                    <button onClick={() => toggleAndRestEdit(false)} type="button" id="cancelEdit" className="btn btn-outline-danger float-right">Cancel</button>
                                    <button onClick={doEdit} type="button" id="update" className="btn btn-outline-primary float-right" style={{marginRight: "10px"}}>Update</button>
                                </div>
                            </div>
                            <div className="form-row">
                                <div className="col-sm-6">
                                    <label className="editLabel" htmlFor="type">Type: </label>
                                    <select className="form-control" id="type" value={room.type} onChange={e => updateState(e.target)}>
                                        <option value="Single">Single</option>
                                        <option value="Twin">Twin</option>
                                        <option value="Double">Double</option>
                                        <option value="Family">Family</option>
                                        <option value="Suite">Suite</option>
                                    </select>
                                    <label className="editLabel" htmlFor="type">Accessible: </label>
                                    <select className="form-control" id="accessible" value={room.accessible} onChange={e => updateState(e.target)}>
                                        <option value="false">false</option>
                                        <option value="true">true</option>
                                    </select>
                                    <label className="editLabel" htmlFor="roomPrice">Room price: </label>
                                    <input className="form-control" type="text" defaultValue={room.roomPrice} id="roomPrice" onChange={e => updateState(e.target)} />
                                </div>
                                <div className="col-sm-6">
                                    <label className="editLabel" htmlFor="description">Description: </label>
                                    <textarea className="form-control" aria-label="Description" defaultValue={room.description} id="description" rows="5" onChange={e => updateState(e.target)}></textarea>
                                </div>
                            </div>
                            <div className="form-row">
                                <div className="col-sm-6">
                                    <label className="editLabel">Room features: </label>
                                    <div className="row">
                                        <div className="col-4">
                                            <div className="form-check form-check-inline">
                                                <input className="form-check-input" type="checkbox" name="featureCheck" id="wifiCheckbox" value="WiFi" checked={room.featuresObject.WiFi} onChange={e => updateState(e.target)} />
                                                <label className="form-check-label" htmlFor="wifiCheckbox">WiFi</label>
                                            </div>
                                        </div>
                                        <div className="col-4">
                                            <div className="form-check form-check-inline">
                                                <input className="form-check-input" type="checkbox" name="featureCheck" id="tvCheckbox" value="TV" checked={room.featuresObject.TV} onChange={e => updateState(e.target)} />
                                                <label className="form-check-label" htmlFor="tvCheckbox">TV</label>
                                            </div>
                                        </div>
                                        <div className="col-4">
                                            <div className="form-check form-check-inline">
                                                <input className="form-check-input" type="checkbox" name="featureCheck" id="radioCheckbox" value="Radio" checked={room.featuresObject.Radio} onChange={e => updateState(e.target)} />
                                                <label className="form-check-label" htmlFor="radioCheckbox">Radio</label>
                                            </div>
                                        </div>
                                    </div>
                                    <div className="row">
                                        <div className="col-4">
                                            <div className="form-check form-check-inline">
                                                <input className="form-check-input" type="checkbox" name="featureCheck" id="refreshCheckbox" value="Refreshments" checked={room.featuresObject.Refreshments} onChange={e => updateState(e.target)} />
                                                <label className="form-check-label" htmlFor="refreshCheckbox">Refreshments</label>
                                            </div>
                                        </div>
                                        <div className="col-4">
                                            <div className="form-check form-check-inline">
                                                <input className="form-check-input" type="checkbox" name="featureCheck" id="safeCheckbox" value="Safe" checked={room.featuresObject.Safe} onChange={e => updateState(e.target)} />
                                                <label className="form-check-label" htmlFor="safeCheckbox">Safe</label>
                                            </div>
                                        </div>
                                        <div className="col-4">
                                            <div className="form-check form-check-inline">
                                                <input className="form-check-input" type="checkbox" name="featureCheck" id="viewsCheckbox" value="Views" checked={room.featuresObject.Views} onChange={e => updateState(e.target)} />
                                                <label className="form-check-label" htmlFor="viewsCheckbox">Views</label>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                                <div className="col-sm-6">
                                    <label className="editLabel" htmlFor="image">Image: </label>
                                    <input type="text" className="form-control" defaultValue={room.image} id="image" onChange={e => updateState(e.target)} />
                                </div>
                            </div>
                            {errorMessages}
                        </div>
    } else {
        roomSummary = <div className="room-details">
                        <div className="row">
                            <div className="col-sm-10">
                                <h2>Room: {room.roomName}</h2>
                            </div>
                            <div className="col-sm-2">
                                <button onClick={() => toggleAndRestEdit(true)} type="button" className="btn btn-outline-primary float-right" style={{marginRight: "10px"}}>Edit</button>
                            </div>
                        </div>
                        <div className="row">
                            <div className="col-sm-6">
                                <p>Type: <span>{room.type}</span></p>
                            </div>
                            <div className="col-sm-6">
                                <p>Description: <span>{room.description.length >= 50 &&
                                    room.description.substring(0,50) + "..."
                                }
                                {room.description.length < 50 &&
                                    room.description
                                }</span></p>
                            </div>
                        </div>
                        <div className="row">
                            <div className="col-sm-6">
                                <p>Accessible: <span>{room.accessible.toString()}</span></p>
                                <p>Features: <span>
                                    {room.features.length > 0 &&
                                        room.features.map((value, index) => {
                                            if(index + 1 === room.features.length){
                                                return value;
                                            } else {
                                                return value + ", ";
                                            }
                                        })
                                    }
                                    {room.features.length === 0 && 
                                        <span style={{color : "grey"}}>No features added to the room</span>
                                    }
                                </span></p>
                                <p>Room price: <span>{room.roomPrice}</span></p>
                            </div>
                            <div className="col-sm-6">
                                <p>Image:</p>
                                <img src={room.image} alt={"Room: " + room.roomName + " preview image"} />
                            </div>
                        </div>
                    </div>
    }

    return(
        <div>
            {roomSummary}
            <div className="row">
                <div className="col-sm-2 rowHeader"><p>First name</p></div>
                <div className="col-sm-2 rowHeader"><p>Last name</p></div>
                <div className="col-sm-1 rowHeader"><p>Price</p></div>
                <div className="col-sm-2 rowHeader"><p>Deposit paid?</p></div>
                <div className="col-sm-2 rowHeader"><p>Check in</p></div>
                <div className="col-sm-2 rowHeader"><p>Check out</p></div>
                <div className="col-sm-1"></div>
            </div>
            <BookingListings roomid={id} roomPrice={room.roomPrice} />
        </div>
    )

}

export default RoomDetails;
