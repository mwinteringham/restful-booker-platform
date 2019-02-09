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
                roomNumber : 0,
                type : "",
                beds : 0,
                accessible : false,
                details : ""
            }
        };

        this.createRoom = this.createRoom.bind(this);
    }

    createRoom() {        
        let vErrors = validate(this.state.newRoom, constraints);

        if(vErrors != null){
            this.setState({errors : vErrors})
        } else {
            fetch(API_ROOT.room + '/room/', {
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
                    document.getElementById("roomNumber").value = '';
                    document.getElementById("type").value = '';
                    document.getElementById("beds").value = '';
                    document.getElementById("accessible").value = '';
                    document.getElementById("details").value = '';
                    
                    this.setState({
                        errors : {},
                        newRoom : {
                            roomNumber : 0,
                            type : "",
                            beds : 0,
                            accessible : false,
                            details : ""
                        }
                    })

                    this.props.updateRooms();
                }
            })
        }
    }
    
    render() {
        let errors = '';
        
        if(Object.keys(this.state.errors).length > 0){
            errors = <div className="alert alert-danger" style={{marginTop : 15 + "px"}}>
                    {Object.keys(this.state.errors).map((key, index) => {
                        return this.state.errors[key].map((value, index) => {
                            return <p key={index}>{value}</p>
                        })
                    })}
            </div>
        }

        return <div>
                    <div className="row">
                        <div className="col-sm-1"><input className="form-control" type="text" id="roomNumber" onChange={val => this.state.newRoom.roomNumber = val.target.value} /></div>
                        <div className="col-sm-2"><input className="form-control" type="text" id="type" onChange={val => this.state.newRoom.type = val.target.value} /></div>
                        <div className="col-sm-1"><input className="form-control" type="text" id="beds" onChange={val => this.state.newRoom.beds = val.target.value} /></div>
                        <div className="col-sm-1"><input className="form-control" type="text" id="accessible" onChange={val => this.state.newRoom.accessible = val.target.value} /></div>
                        <div className="col-sm-6"><input className="form-control" type="text" id="details" onChange={val => this.state.newRoom.details = val.target.value} /></div>
                        <div className="col-sm-1">
                            <button className="btn btn-outline-dark" id="createRoom" type="submit" onClick={this.createRoom}>Create</button>
                        </div>
                    </div>
                    {errors}
                </div>
    }

}