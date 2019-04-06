import React from 'react';
import validate from 'validate.js';
import { constraints } from '../libs/ValidateRules.js'
import { API_ROOT } from '../api-config';

export default class RoomForm extends React.Component {

    constructor() {
        super();

		this.state = {
            errors : {},
            rooms : [], 
            newRoom : {
                roomNumber : "",
                type : "Single",
                accessible : false,
                description : "Please enter a description for this room",
                image : 'https://www.mwtestconsultancy.co.uk/img/room1.jpg',
                features : {
                    WiFi : false,
                    TV : false,
                    Radio : false,
                    Refreshments : false,
                    Safe : false,
                    Views : false
                }
            }
        };

        this.createRoom = this.createRoom.bind(this);
        this.updateState = this.updateState.bind(this);
    }
    
    createRoom() {
        let roomToCreate = this.state.newRoom;
        let featureObject = this.state.newRoom.features;
        let featuresArray = [];
        
        for (let property in featureObject) {
            if(featureObject[property] === true){
                featuresArray.push(property);
            }
        }
        
        roomToCreate.features = featuresArray;
        let vErrors = validate(roomToCreate, constraints.room);
        
        if(vErrors != null){
            this.setState({errors : vErrors})
        } else {
            fetch(API_ROOT + '/room/', {
                method: 'POST',
                headers: {
                    'Accept': 'application/json',
                    'Content-Type': 'application/json'
                },
                credentials: 'include',
                body : JSON.stringify(this.state.newRoom)
            })
            .then(res => {
                if(res.status == 200){
                    this.setState({
                        errors : {},
                        newRoom : {
                            roomNumber : "",
                            type : "Single",
                            accessible : false,
                            description : "Please enter a description for this room",
                            image : 'https://www.mwtestconsultancy.co.uk/img/room1.jpg',
                            features : {
                                WiFi : false,
                                TV : false,
                                Radio : false,
                                Refreshments : false,
                                Safe : false,
                                Views : false
                            }
                        }
                    });
                    
                    this.props.updateRooms();
                }
            })
        }
    }

    updateState(event){
        let currentState = this.state;

        if(event.target.name === 'featureCheck'){
            currentState.newRoom.features[event.target.value] = event.target.checked;
        } else {
            currentState.newRoom[event.target.id] = event.target.value;
        }

        this.setState(currentState);
    }
    
    render() {
        let errors = '';
        
        if(Object.keys(this.state.errors).length > 0){
            errors = <div className="alert alert-danger" style={{marginBottom : 5 + "rem"}}>
                    {Object.keys(this.state.errors).map((key, index) => {
                        return this.state.errors[key].map((value, index) => {
                            return <p key={index}>{value}</p>
                        })
                    })}
            </div>
        }

        return <div>
                    <div className="row room-form">
                        <div className="col-sm-1">
                            <input className="form-control" type="text" id="roomNumber" value={this.state.newRoom.roomNumber} onChange={this.updateState} />
                        </div>
                        <div className="col-sm-2">
                            <select className="form-control" id="type" value={this.state.newRoom.type} onChange={this.updateState}>
                                <option value="Single">Single</option>
                                <option value="Twin">Twin</option>
                                <option value="Double">Double</option>
                                <option value="Family">Family</option>
                                <option value="Suite">Suite</option>
                            </select>
                        </div>
                        <div className="col-sm-2">
                            <select className="form-control" id="accessible" value={this.state.newRoom.accessible} onChange={this.updateState}>
                                <option value="false">false</option>
                                <option value="true">true</option>
                            </select>
                        </div>
                        <div className="col-sm-6">
                            <div className="row">
                                <div className="col-4">
                                    <div className="form-check form-check-inline">
                                        <input className="form-check-input" type="checkbox" name="featureCheck" id="wifiCheckbox" value="WiFi" checked={this.state.newRoom.features.wifi} onChange={this.updateState} />
                                        <label className="form-check-label" htmlFor="wifiCheckbox">WiFi</label>
                                    </div>
                                </div>
                                <div className="col-4">
                                    <div className="form-check form-check-inline">
                                        <input className="form-check-input" type="checkbox" name="featureCheck" id="tvCheckbox" value="TV" checked={this.state.newRoom.features.tv} onChange={this.updateState} />
                                        <label className="form-check-label" htmlFor="tvCheckbox">TV</label>
                                    </div>
                                </div>
                                <div className="col-4">
                                    <div className="form-check form-check-inline">
                                        <input className="form-check-input" type="checkbox" name="featureCheck" id="radioCheckbox" value="Radio" checked={this.state.newRoom.features.radio} onChange={this.updateState} />
                                        <label className="form-check-label" htmlFor="radioCheckbox">Radio</label>
                                    </div>
                                </div>
                            </div>
                            <div className="row">
                                <div className="col-4">
                                    <div className="form-check form-check-inline">
                                        <input className="form-check-input" type="checkbox" name="featureCheck" id="refreshCheckbox" value="Refreshments" checked={this.state.newRoom.features.refreshments} onChange={this.updateState} />
                                        <label className="form-check-label" htmlFor="refreshCheckbox">Refreshments</label>
                                    </div>
                                </div>
                                <div className="col-4">
                                    <div className="form-check form-check-inline">
                                        <input className="form-check-input" type="checkbox" name="featureCheck" id="safeCheckbox" value="Safe" checked={this.state.newRoom.features.safe} onChange={this.updateState} />
                                        <label className="form-check-label" htmlFor="safeCheckbox">Safe</label>
                                    </div>
                                </div>
                                <div className="col-4">
                                    <div className="form-check form-check-inline">
                                        <input className="form-check-input" type="checkbox" name="featureCheck" id="viewsCheckbox" value="Views" checked={this.state.newRoom.features.views} onChange={this.updateState} />
                                        <label className="form-check-label" htmlFor="viewsCheckbox">Views</label>
                                    </div>
                                </div>
                            </div>
                        </div>
                        <div className="col-sm-1">
                            <button className="btn btn-outline-primary" id="createRoom" type="submit" onClick={this.createRoom}>Create</button>
                        </div>
                    </div>
                    {errors}
                </div>
    }

}