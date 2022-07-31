import React, { useEffect, useState } from 'react';
import DatePicker from 'react-datepicker';
import moment from 'moment/moment';
import { API } from '../libs/Api.js';

import "react-datepicker/dist/react-datepicker.css";

const BookingListing = ({booking, getBookings, roomPrice}) => {

    const [allowEdit, toggleEdit] = useState(false);
    const [editBooking, setEditBooking] = useState({});

    useEffect(() => {
        setEditBooking(booking);
    }, [])

    const doDelete = () => {
        API.deleteBooking(editBooking.bookingid, getBookings)
    }

    const doEdit = () => {
        API.updateBooking(editBooking, toggleEdit, getBookings)
    }

    const handleDateChange = (date, target) => {
        editBooking.bookingdates[target] = moment(date.toUTCString()).format("YYYY-MM-DD");;

        setEditBooking(prevState => ({
            ...prevState
        }));
    }

    const updateState = (event) => {
        editBooking[event.name] = event.value;

        setEditBooking(prevState => ({
            ...prevState
        }));
    }

    let calculatedPrice;
    if(roomPrice && booking.bookingdates){
        calculatedPrice = roomPrice * Math.round(Math.abs((new Date(booking.bookingdates.checkin).getTime() - new Date(booking.bookingdates.checkout).getTime())/(24*60*60*1000)));
    } else {
        calculatedPrice = 0;
    }
    
    let bookingView = null;

    if(allowEdit){
        bookingView = <div className="row">
                    <div className="col-sm-2"><input type="text" className="form-control" name="firstname" defaultValue={booking.firstname} onChange={e => updateState(e.target)} /></div>
                    <div className="col-sm-2"><input type="text" className="form-control" name="lastname" defaultValue={booking.lastname} onChange={e => updateState(e.target)} /></div>
                    <div className="col-sm-1"><p>{roomPrice}</p></div>
                    <div className="col-sm-2">
                        <select className="form-control" defaultValue={booking.depositpaid} name="depositpaid" onChange={e => updateState(e.target)}>
                            <option value="false">false</option>
                            <option value="true">true</option>
                        </select>
                    </div>
                    <div className="col-sm-2"><DatePicker className="form-control" selected={moment(booking.bookingdates.checkin).utc(true).toDate()} onChange={date => handleDateChange(date, 'checkin')} dateFormat="yyyy-MM-dd" /></div>
                    <div className="col-sm-2"><DatePicker className="form-control" selected={moment(booking.bookingdates.checkout).utc(true).toDate()} onChange={date => handleDateChange(date, 'checkout')} dateFormat="yyyy-MM-dd" /></div>
                    <div className="col-sm-1">
                        <span className="fa fa-check confirmBookingEdit" onClick={doEdit} style={{paddingRight : 10 + "px"}}></span>
                        <span className="fa fa-remove exitBookingEdit" onClick={() => {toggleEdit(false)}}></span>
                    </div>
                </div>
    } else {
        bookingView = <div className="row">
                    <div className="col-sm-2"><p>{booking.firstname}</p></div>
                    <div className="col-sm-2"><p>{booking.lastname}</p></div>
                    <div className="col-sm-1"><p>{calculatedPrice}</p></div>
                    <div className="col-sm-2"><p>{String(booking.depositpaid)}</p></div>
                    <div className="col-sm-2"><p>{booking.bookingdates.checkin.split('T')[0]}</p></div>
                    <div className="col-sm-2"><p>{booking.bookingdates.checkout.split('T')[0]}</p></div>
                    <div className="col-sm-1">
                        <span className="fa fa-pencil bookingEdit" onClick={() => {toggleEdit(true)}} style={{paddingRight: 10 + "px"}}></span>
                        <span className="fa fa-trash bookingDelete" onClick={doDelete}></span>
                    </div>
                    </div>
    }

    return(
        <div className={"detail booking-" + booking.roomid}>
            {bookingView}
        </div>
    )

}

export default BookingListing;
