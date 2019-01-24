import React from 'react';
import BookingListings from './BookingListings.jsx';
import Form from './BookingForm.jsx';
import validate from 'validate.js';
import { constraints } from '../libs/ValidateRules.js'
import { API_ROOT } from '../api-config';

export default class RoomDetails extends React.Component {

    constructor(){
        super()

        this.state = {
            edit : false,
            orgRoom : {
                roomNumber : 0,
                type : "",
                beds : 0,
                accessible : false,
                details : "",
                bookings : []
            },
            editRoom : {
                roomNumber : 0,
                type : "",
                beds : 0,
                accessible : false,
                details : ""
            },
            errors : {}
        }

        this.enableEdit = this.enableEdit.bind(this);
        this.disableEdit = this.disableEdit.bind(this);
        this.doEdit = this.doEdit.bind(this);
        this.fetchRoomDetails = this.fetchRoomDetails.bind(this);
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
        let vErrors = validate(this.state.editRoom, constraints);

        if(vErrors != null){
            this.setState({errors : vErrors})
        } else {
            fetch(API_ROOT.room + '/room/' + this.props.params.id, {
                method: 'PUT',
                headers: {
                    'Accept': 'application/json',
                    'Content-Type': 'application/json'
                },
                credentials: 'include',
                body : JSON.stringify(this.state.editRoom)
            })
            .then(res => res.json())
            .then(res => {
                this.setState({errors : {}});
                this.setState({edit : false});
                this.fetchRoomDetails();
            })
            .catch(e => console.log(e));
        }
    }

    fetchRoomDetails() {
        fetch(API_ROOT.room + '/room/' + this.props.params.id, {
            headers: {
				'Accept': 'application/json',
				'Content-Type': 'application/json'
			}
        })
        .then(res => res.json())
        .then(res => {
            this.setState({orgRoom : res, editRoom : res})
        })
        .catch(e => console.log(e));
    }

    render(){
        let roomSummary = null;
        let bookings = null;
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

        if(this.state.edit == true){
            roomSummary =  <div>
                                <div className="row">
                                    <div className="col-sm-6">
                                        <h2>Room: <input type="text" defaultValue={this.state.orgRoom.roomNumber} style={{width: "70%"}} onChange={val => this.state.editRoom.roomNumber = val.target.value} />
                                            <span className="fa fa-ok confirmRoomEdit" onClick={this.doEdit} style={{paddingLeft: 10 + "px", fontSize: 0.5 + "em"}}></span>
                                            <span className="fa fa-remove exitRoomEdit" onClick={this.disableEdit} style={{paddingLeft: 10 + "px", fontSize: 0.5 + "em"}}></span>
                                        </h2>
                                        <p>Type: <input type="text" defaultValue={this.state.orgRoom.type} onChange={val => this.state.editRoom.type = val.target.value} /></p>
                                        <p>Beds: <input type="text" defaultValue={this.state.orgRoom.beds} onChange={val => this.state.editRoom.beds = val.target.value} /></p>
                                        <p>Accessible: <input type="text" defaultValue={this.state.orgRoom.accessible} onChange={val => this.state.editRoom.accessible = val.target.value} /></p>
                                    </div>
                                    <div className="col-sm-6">
                                        <p style={{marginTop: "69px"}}>Details: <input type="text" defaultValue={this.state.orgRoom.details} onChange={val => this.state.editRoom.details = val.target.value}/></p>
                                    </div>
                                </div>
                                {errors}
                            </div>
        } else {
            roomSummary = <div className="row">
                            <div className="col-sm-6">
                                <h2>Room: {this.state.orgRoom.roomNumber} <span className="fa fa-pencil roomEdit" onClick={this.enableEdit} style={{marginLeft: "5px", fontSize: 0.5 + "em"}} ></span></h2>
                                <p>Type: <span>{this.state.orgRoom.type}</span></p>
                                <p>Beds: <span>{this.state.orgRoom.beds}</span></p>
                                <p>Accessible: <span>{this.state.orgRoom.accessible.toString()}</span></p>
                            </div>
                                <div className="col-sm-6">
                                    <p style={{marginTop: "63px"}}>Details: <span>{this.state.orgRoom.details}</span></p>
                                </div>
                            </div>
        }

        if(this.state.orgRoom.bookings){
            bookings = <BookingListings fetchRoomDetails={this.fetchRoomDetails} roomid={this.props.params.id} bookings={this.state.orgRoom.bookings} />
        }

        return(
            <div>
                <div className="well">
                    <div className="container-fluid">
                        {roomSummary}
                    </div>
                </div>
                <div className="row">
                    <div className="col-sm-2 rowHeader"><p>First name</p></div>
                    <div className="col-sm-2 rowHeader"><p>Last name</p></div>
                    <div className="col-sm-1 rowHeader"><p>Price</p></div>
                    <div className="col-sm-2 rowHeader"><p>Deposit paid?</p></div>
                    <div className="col-sm-2 rowHeader"><p>Check in</p></div>
                    <div className="col-sm-2 rowHeader"><p>Check out</p></div>
                    <div className="col-sm-1"></div>
                </div>
                {bookings}
                <Form fetchRoomDetails={this.fetchRoomDetails} roomid={this.props.params.id}/>
            </div>
        )
    }

}