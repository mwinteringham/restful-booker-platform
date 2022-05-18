import React, { useEffect, useState } from 'react';
import ReactModal from 'react-modal';
import moment from 'moment/moment';
import { API } from '../libs/Api.js';

const AdminBooking = ({closeBooking, dates}) => {

    const [rooms, setRooms] = useState([]);
    const [booking, setBooking] = useState({
        firstname : '',
        lastname : '',
        depositpaid : false,
        roomid : 0,
        bookingdates : {}
    });
    const [errors, setErrors] = useState([]);
    
    useEffect(() => {
        booking.bookingdates.checkin = moment(dates.start).format("YYYY-MM-DD");
        booking.bookingdates.checkout = moment(dates.end).format("YYYY-MM-DD");

        setBooking(prevState => ({
            ...prevState
        }));
    
        API.getRoom(setRooms);
    }, []);

    const updateState = (event) => {
        booking[event.name] = event.value;

        setBooking(prevState => ({
            ...prevState
        }));
    }

    const doBooking = () => {
        API.postBooking(booking, closeBooking, setErrors);
    }

    let errorDetails;

    if(errors.length > 0){
        errorDetails = <div className="alert alert-danger" style={{marginTop : 1 + "rem"}}>
            {errors.map((value) => {
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
                        <input type="text" className="form-control" placeholder="Firstname" aria-label="Firstname" name="firstname" aria-describedby="basic-addon1" value={booking.firstname} onChange={e => updateState(e.target)} />    
                    </div>
                    <div className="col-6">
                    <input type="text" className="form-control" placeholder="Lastname" aria-label="Lastname" name="lastname" aria-describedby="basic-addon1" value={booking.lastname} onChange={e => updateState(e.target)} />
                    </div>
                </div>
                <div className="form-row room-booking-form">
                    <div className="col-6">
                        <div className="input-group-prepend">
                            <span className="input-group-text" id="basic-addon1">Room</span>
                            <select className="form-control" name="roomid" id="roomid" value={booking.roomid} onChange={e => updateState(e.target)}>
                            <option value="0">Select room</option>
                            {rooms.map((room) => {
                                return <option key={room.roomid} value={room.roomid}>{room.roomName}</option>
                            })}
                            </select>
                        </div>
                    </div>
                    <div className="col-6">
                        <div className="input-group-prepend">
                            <span className="input-group-text" id="basic-addon1">Deposit paid?</span>
                            <select className="form-control" name="depositpaid" id="depositpaid" value={booking.depositpaid} onChange={e => updateState(e.target)}>
                                <option value="false">false</option>
                                <option value="true">true</option>
                            </select>
                        </div>
                    </div>
                </div>
                <div className="form-row room-booking-form">
                    <div className="col-6">
                        <p><span style={{fontWeight : "bold"}}>Checkin: </span>{booking.bookingdates.checkin}</p>
                    </div>
                    <div className="col-6">
                        <p><span style={{fontWeight : "bold"}}>Checkout: </span>{booking.bookingdates.checkout}</p>
                    </div>
                </div>
                <div className="form-row room-booking-form">
                    <div className="col-sm-12 text-right">
                        <button type='button' className='btn btn-outline-danger float-right book-room' onClick={() => closeBooking()}>Cancel</button>
                        <button type='button' className='btn btn-outline-primary float-right book-room' style={{marginRight : '10px' }} onClick={() => doBooking()}>Book</button>
                    </div>
                </div>
                {errorDetails}
            </ReactModal>

}

export default AdminBooking;
