import React from 'react';
import BookingListings from './BookingListings.jsx';
import { API_ROOT } from '../api-config';
import { API } from '../libs/Api.js';
import fetch from 'node-fetch';

export default class RoomDetails extends React.Component {

    constructor(){
        super()

        this.state = {
            edit : false,
            room : {
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
            },
            errors : []
        }

        this.enableEdit = this.enableEdit.bind(this);
        this.disableEdit = this.disableEdit.bind(this);
        this.doEdit = this.doEdit.bind(this);
        this.fetchRoomDetails = this.fetchRoomDetails.bind(this);
        this.updateState = this.updateState.bind(this);
        this.resetForm = this.resetForm.bind(this);
    }

    componentDidMount(){
        this.fetchRoomDetails();
    }

    enableEdit(){
        this.setState({edit : true, errors : {}});
    }

    disableEdit(){
        this.setState({edit : false, errors : {}});
    }

    doEdit(){
        this.state.room.features = Object.keys(this.state.room.featuresObject).filter(key => this.state.room.featuresObject[key]);

        API.putRoom(this);
    }

    resetForm() {
        this.setState({
            edit : false,
            room : {
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
            },
            errors : []
        });
    }

    fetchRoomDetails() {
        fetch(API_ROOT + '/room/' + this.props.params.id, {
            headers: {
				'Accept': 'application/json',
				'Content-Type': 'application/json'
			}
        })
        .then(res => res.json())
        .then(res => {
            res.featuresObject = this.state.room.featuresObject;

            for (let i = 0; i < res.features.length; i++) {
                res.featuresObject[res.features[i]] = true
            }

            this.setState({ room : res });
        });
    }

    updateState(event){
        let currentState = this.state;

        if(event.target.name === 'featureCheck'){
            currentState.room.featuresObject[event.target.value] = event.target.checked;
        } else {
            currentState.room[event.target.id] = event.target.value;
        }

        this.setState(currentState);
    }

    render(){
        let roomSummary = null;
        let errors = '';
        
        if(this.state.errors.length > 0){
            errors = <div className="alert alert-danger" style={{marginTop : 15 + "px"}}>
                {this.state.errors.map((value) => {
                    return <p key={value}>{value}</p>
                })}
            </div>
        }

        if(this.state.edit == true){
            roomSummary =  <div className="room-details">
                                <div className="form-row">
                                    <div className="col-sm-9">
                                        <h2>Room: </h2>
                                        <input type="text" defaultValue={this.state.room.roomNumber} id="roomNumber" onChange={this.updateState} />
                                    </div>
                                    <div className="col-sm-3">
                                        <button onClick={this.disableEdit} type="button" id="cancelEdit" className="btn btn-outline-danger float-right">Cancel</button>
                                        <button onClick={this.doEdit} type="button" id="update" className="btn btn-outline-primary float-right" style={{marginRight: "10px"}}>Update</button>
                                    </div>
                                </div>
                                <div className="form-row">
                                    <div className="col-sm-6">
                                        <label className="editLabel" htmlFor="type">Type: </label>
                                        <select className="form-control" id="type" value={this.state.room.type} onChange={this.updateState}>
                                            <option value="Single">Single</option>
                                            <option value="Twin">Twin</option>
                                            <option value="Double">Double</option>
                                            <option value="Family">Family</option>
                                            <option value="Suite">Suite</option>
                                        </select>
                                        <label className="editLabel" htmlFor="type">Accessible: </label>
                                        <select className="form-control" id="accessible" value={this.state.room.accessible} onChange={this.updateState}>
                                            <option value="false">false</option>
                                            <option value="true">true</option>
                                        </select>
                                        <label className="editLabel" htmlFor="roomPrice">Room price: </label>
                                        <input className="form-control" type="text" defaultValue={this.state.room.roomPrice} id="roomPrice" onChange={this.updateState} />
                                    </div>
                                    <div className="col-sm-6">
                                        <label className="editLabel" htmlFor="description">Description: </label>
                                        <textarea className="form-control" aria-label="Description" defaultValue={this.state.room.description} id="description" rows="5" onChange={this.updateState}></textarea>
                                    </div>
                                </div>
                                <div className="form-row">
                                    <div className="col-sm-6">
                                        <label className="editLabel">Room features: </label>
                                        <div className="row">
                                            <div className="col-4">
                                                <div className="form-check form-check-inline">
                                                    <input className="form-check-input" type="checkbox" name="featureCheck" id="wifiCheckbox" value="WiFi" checked={this.state.room.featuresObject.WiFi} onChange={this.updateState} />
                                                    <label className="form-check-label" htmlFor="wifiCheckbox">WiFi</label>
                                                </div>
                                            </div>
                                            <div className="col-4">
                                                <div className="form-check form-check-inline">
                                                    <input className="form-check-input" type="checkbox" name="featureCheck" id="tvCheckbox" value="TV" checked={this.state.room.featuresObject.TV} onChange={this.updateState} />
                                                    <label className="form-check-label" htmlFor="tvCheckbox">TV</label>
                                                </div>
                                            </div>
                                            <div className="col-4">
                                                <div className="form-check form-check-inline">
                                                    <input className="form-check-input" type="checkbox" name="featureCheck" id="radioCheckbox" value="Radio" checked={this.state.room.featuresObject.Radio} onChange={this.updateState} />
                                                    <label className="form-check-label" htmlFor="radioCheckbox">Radio</label>
                                                </div>
                                            </div>
                                        </div>
                                        <div className="row">
                                            <div className="col-4">
                                                <div className="form-check form-check-inline">
                                                    <input className="form-check-input" type="checkbox" name="featureCheck" id="refreshCheckbox" value="Refreshments" checked={this.state.room.featuresObject.Refreshments} onChange={this.updateState} />
                                                    <label className="form-check-label" htmlFor="refreshCheckbox">Refreshments</label>
                                                </div>
                                            </div>
                                            <div className="col-4">
                                                <div className="form-check form-check-inline">
                                                    <input className="form-check-input" type="checkbox" name="featureCheck" id="safeCheckbox" value="Safe" checked={this.state.room.featuresObject.Safe} onChange={this.updateState} />
                                                    <label className="form-check-label" htmlFor="safeCheckbox">Safe</label>
                                                </div>
                                            </div>
                                            <div className="col-4">
                                                <div className="form-check form-check-inline">
                                                    <input className="form-check-input" type="checkbox" name="featureCheck" id="viewsCheckbox" value="Views" checked={this.state.room.featuresObject.Views} onChange={this.updateState} />
                                                    <label className="form-check-label" htmlFor="viewsCheckbox">Views</label>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                    <div className="col-sm-6">
                                        <label className="editLabel" htmlFor="image">Image: </label>
                                        <input type="text" className="form-control" defaultValue={this.state.room.image} id="image" onChange={this.updateState} />
                                    </div>
                                </div>
                                {errors}
                            </div>
        } else {
            roomSummary = <div className="room-details">
                            <div className="row">
                                <div className="col-sm-10">
                                    <h2>Room: {this.state.room.roomNumber}</h2>
                                </div>
                                <div className="col-sm-2">
                                    <button onClick={this.enableEdit} type="button" className="btn btn-outline-primary float-right" style={{marginRight: "10px"}}>Edit</button>
                                </div>
                            </div>
                            <div className="row">
                                <div className="col-sm-6">
                                    <p>Type: <span>{this.state.room.type}</span></p>
                                </div>
                                <div className="col-sm-6">
                                    <p>Description: <span>{this.state.room.description.length >= 50 &&
                                        this.state.room.description.substring(0,50) + "..."
                                    }
                                    {this.state.room.description.length < 50 &&
                                        this.state.room.description
                                    }</span></p>
                                </div>
                            </div>
                            <div className="row">
                                <div className="col-sm-6">
                                    <p>Accessible: <span>{this.state.room.accessible.toString()}</span></p>
                                    <p>Features: <span>
                                        {this.state.room.features.length > 0 &&
                                            this.state.room.features.map((value, index) => {
                                                if(index + 1 === this.state.room.features.length){
                                                    return value;
                                                } else {
                                                    return value + ", ";
                                                }
                                            })
                                        }
                                        {this.state.room.features.length === 0 && 
                                            <span style={{color : "grey"}}>No features added to the room</span>
                                        }
                                    </span></p>
                                    <p>Room price: <span>{this.state.room.roomPrice}</span></p>
                                </div>
                                <div className="col-sm-6">
                                    <p>Image:</p>
                                    <img src={this.state.room.image} alt={"Room: " + this.state.room.roomNumber + " preview image"} />
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
                <BookingListings fetchRoomDetails={this.fetchRoomDetails} roomid={this.props.params.id} roomPrice={this.state.room.roomPrice} />
            </div>
        )
    }

}