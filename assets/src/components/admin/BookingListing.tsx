import React, { useEffect, useState } from 'react';
import DatePicker from 'react-datepicker';
import moment from 'moment/moment';

import { Booking as BookingType } from '@/types/booking';
import { registerLocale, setDefaultLocale } from  "react-datepicker";
import { enGB } from 'date-fns/locale/en-GB';
registerLocale('en-GB', enGB)
setDefaultLocale('en-GB');

import "react-datepicker/dist/react-datepicker.css";

interface BookingListingProps {
  booking: BookingType
  getBookings: () => void;
  roomPrice?: number;
}

const BookingListing: React.FC<BookingListingProps> = ({booking, getBookings, roomPrice}) => {
    const [allowEdit, toggleEdit] = useState(false);
    const [editBooking, setEditBooking] = useState(booking);

    useEffect(() => {
        setEditBooking(booking);
    }, [booking])

    const doDelete = () => {
        fetch(`/api/booking/${editBooking.bookingid}`, {
            method: 'DELETE'
        })
        .then(response => {
            if (response.ok) {
                getBookings();
            }
        })
        .catch(error => console.error('Error deleting booking:', error));
    }

    const doEdit = () => {
        fetch(`/api/booking/${editBooking.bookingid}`, {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(editBooking)
        })
        .then(response => {
            if (response.ok) {
                toggleEdit(false);
                getBookings();
            }
        })
        .catch(error => console.error('Error updating booking:', error));
    }

    const handleDateChange = (date: Date | null, target: 'checkin' | 'checkout') => {
        if (date) {
            const formattedDate = moment(date.toUTCString()).format("YYYY-MM-DD");
            setEditBooking(prevState => {
                const newState = { ...prevState };
                newState.bookingdates[target] = formattedDate;
                return newState;
            });
        }
    }

    const updateState = (event: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
        const { name, value } = event.target;
        setEditBooking(prevState => ({
            ...prevState,
            [name]: name === 'depositpaid' ? value === 'true' : value
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
                    <div className="col-sm-2"><input type="text" className="form-control" name="firstname" defaultValue={booking.firstname} onChange={updateState} /></div>
                    <div className="col-sm-2"><input type="text" className="form-control" name="lastname" defaultValue={booking.lastname} onChange={updateState} /></div>
                    <div className="col-sm-1"><p>{roomPrice}</p></div>
                    <div className="col-sm-2">
                        <select className="form-control" defaultValue={String(booking.depositpaid)} name="depositpaid" onChange={updateState}>
                            <option value="false">false</option>
                            <option value="true">true</option>
                        </select>
                    </div>
                    <div className="col-sm-2">
                        <DatePicker wrapperClassName="dateWrapper" className="form-control" dateFormat="P" selected={moment(booking.bookingdates.checkin).utc(true).toDate()} onChange={(date: Date | null) => handleDateChange(date, 'checkin')} />
                    </div>
                    <div className="col-sm-2">
                        <DatePicker wrapperClassName="dateWrapper" className="form-control" dateFormat="P" selected={moment(booking.bookingdates.checkout).utc(true).toDate()} onChange={(date: Date | null) => handleDateChange(date, 'checkout')} />
                    </div>
                    <div className="col-sm-1">
                        <span className="fa fa-check confirmBookingEdit" onClick={doEdit} style={{paddingRight: "10px"}}></span>
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
                        <span className="fa fa-pencil bookingEdit" onClick={() => {toggleEdit(true)}} style={{paddingRight: "10px"}}></span>
                        <span className="fa fa-trash bookingDelete" onClick={doDelete}></span>
                    </div>
                    </div>
    }

    return(
        <div className={`detail booking-${booking.roomid}`}>
            {bookingView}
        </div>
    )
}

export default BookingListing; 