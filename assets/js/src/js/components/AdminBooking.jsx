import React from 'react';
import ReactModal from 'react-modal';
import { API } from '../libs/Api.js';

export default class AdminBooking extends React.Component {

    constructor(){
        super();

        this.state = {
            completed : false,
            rooms : [],
            booking : {
                bookingdates : {}
            },
            errors : []
        }

        this.doBooking = this.doBooking.bind(this);
        this.updateState = this.updateState.bind(this);
    }

    componentDidMount(){
        const startDate = new Date(Date.UTC(this.props.dates.start.getFullYear(), this.props.dates.start.getMonth(), this.props.dates.start.getDate(), this.props.dates.start.getHours(), this.props.dates.start.getMinutes(), this.props.dates.start.getSeconds()));
        const endDate = new Date(Date.UTC(this.props.dates.end.getFullYear(), this.props.dates.end.getMonth(), this.props.dates.end.getDate(), this.props.dates.end.getHours(), this.props.dates.end.getMinutes(), this.props.dates.end.getSeconds()));

        this.setState({
            booking : {
                firstname : '',
                lastname : '',
                depositpaid : false,
                roomid : 0,
                bookingdates : {
                    checkin : startDate.toISOString().split('T')[0],
                    checkout : endDate.toISOString().split('T')[0]
                }
            }
        });

        API.getRoom(this);
    }

    componentDidUpdate(){
        if(this.state.completed){
            this.props.closeBooking();
        }
    }

    updateState(target){
        let currentState = this.state;

		currentState.booking[event.target.name] = event.target.value;
				
		this.setState(currentState);
    }

    doBooking(){
        API.postBooking(this);
    }

    render(){
        let errors;

		if(this.state.errors.length > 0){
            errors = <div className="alert alert-danger" style={{marginTop : 1 + "rem"}}>
                {this.state.errors.map((value) => {
                    return <p key={value}>{value}</p>
                })}
            </div>
        }

        return <ReactModal 
                    isOpen={true}
                    contentLabel="onRequestClose Example"
                    className="confirmation-modal"
                    >
                    
                    <div className="form-row">
                        <div className="col-6">
                            <input type="text" className="form-control" placeholder="Firstname" aria-label="Firstname" name="firstname" aria-describedby="basic-addon1" value={this.state.booking.firstname} onChange={this.updateState} />    
                        </div>
                        <div className="col-6">
                        <input type="text" className="form-control" placeholder="Lastname" aria-label="Lastname" name="lastname" aria-describedby="basic-addon1" value={this.state.booking.lastname} onChange={this.updateState} />
                        </div>
                    </div>
                    <div className="form-row room-booking-form">
                        <div className="col-6">
                            <div className="input-group-prepend">
                                <span className="input-group-text" id="basic-addon1">Room</span>
                                <select className="form-control" name="roomid" id="roomid" value={this.state.booking.roomid} onChange={this.updateState}>
                                <option value="0">Select room</option>
                                {this.state.rooms.map((room) => {
                                    return <option key={room.roomid} value={room.roomid}>{room.roomNumber}</option>
                                })}
                                </select>
                            </div>
                        </div>
                        <div className="col-6">
                            <div className="input-group-prepend">
                                <span className="input-group-text" id="basic-addon1">Deposit paid?</span>
                                <select className="form-control" name="depositpaid" id="depositpaid" value={this.state.booking.depositpaid} onChange={this.updateState}>
                                    <option value="false">false</option>
                                    <option value="true">true</option>
                                </select>
                            </div>
                        </div>
                    </div>
                    <div className="form-row room-booking-form">
                        <div className="col-6">
                            <p><span style={{fontWeight : "bold"}}>Checkin: </span>{this.state.booking.bookingdates.checkin}</p>
                        </div>
                        <div className="col-6">
                            <p><span style={{fontWeight : "bold"}}>Checkout: </span>{this.state.booking.bookingdates.checkout}</p>
                        </div>
                    </div>
                    <div className="form-row room-booking-form">
                        <div className="col-sm-12 text-right">
                            <button type='button' className='btn btn-outline-danger float-right book-room' onClick={() => this.props.closeBooking()}>Cancel</button>
					        <button type='button' className='btn btn-outline-primary float-right book-room' style={{marginRight : '10px' }} onClick={() => this.doBooking()}>Book</button>
                        </div>
                    </div>
                    {errors}
                </ReactModal>
    }

}