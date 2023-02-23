import React, { useEffect, useState } from 'react';
import { Calendar, momentLocalizer } from 'react-big-calendar';
import moment from 'moment/moment';
import { API } from '../libs/Api';
import BookingConfirmation from './BookingConfirmation.js';

import "react-big-calendar/lib/css/react-big-calendar.css";

const RoomBookingForm = ({roomid, roomPrice, toggleBooking}) => {

    const [completed, setComplete] = useState(false);
	const [events, setEvents] = useState([]);
	const [newEvent, setNewEvent] = useState([]);
	const [errors, setErrors] = useState([]);
	const [booking, setBooking] = useState({
		bookingdates :	{
			checkin : '',
			checkout : ''
		},
		depositpaid	: false,
		firstname : '',
		lastname : '',
		roomid : roomid,
		email : '',
		phone : ''
	});
	
	useEffect(() => {
		API.getRoomReport(roomid, setEvents);
	}, [])

	const updateState = (event) => {
		booking[event.name] = event.value;

        setBooking(prevState => ({
            ...prevState
        }));
	}

    const handleSelect = (result) => {
		if(result.slots.length > 1){
			let currentBookingDates = booking.bookingdates;
			
			currentBookingDates.checkin = moment(result.start).format("YYYY-MM-DD");
			currentBookingDates.checkout = moment(result.end).format("YYYY-MM-DD");
			
			setBooking(prevState => ({
				...prevState
			}));

			setNewEvent([
				{
					start : moment(result.start).toDate(),
					end : moment(result.end).toDate(),
					title : (result.slots.length - 1) + ' night(s) - £' + ((result.slots.length - 1) * roomPrice)
				}
			])
		}
	}
	
	const submitForm = () => {
		API.postBooking(booking, setComplete, setErrors);
	}

	const closeConfirmation = () => {
		setComplete(true);
		toggleBooking();
    }

	let renderErrors;

	if(errors.length > 0){
		renderErrors = <div className="alert alert-danger" style={{marginTop : 5 + "rem"}}>
			{errors.map((value, id) => {
				return <p key={id}>{value}</p>
			})}
		</div>
	}

	const localizer = momentLocalizer(moment);

	if(completed){
		return <BookingConfirmation booking={booking} closeConfirmation={closeConfirmation}/>
	} else {
		return <div className="row hotel-room-info">
			<div className="col-sm-1"></div>
			<div className="col-sm-6">
			<Calendar
				localizer={localizer}
				onSelectSlot={handleSelect}
				defaultView="month"
				selectable
				popup={true}
				events={newEvent.concat(events)}
				style={{ height: "60vh" }}
				views={['month']}
			/>
			</div>
			<div className="col-sm-4">
				<div className="input-group mb-3 room-booking-form">
					<div className="input-group-prepend">
						<span className="input-group-text" id="basic-addon1"><span className="fa fa-id-card"></span></span>
					</div>
					<input type="text" className="form-control room-firstname" placeholder="Firstname" aria-label="Firstname" name="firstname" aria-describedby="basic-addon1" value={booking.firstname} onChange={e => updateState(e.target)} />
				</div>
				<div className="input-group mb-3">
					<div className="input-group-prepend">
						<span className="input-group-text" id="basic-addon1"><span className="fa fa-id-card"></span></span>
					</div>
					<input type="text" className="form-control room-lastname" placeholder="Lastname" aria-label="Lastname" name="lastname" aria-describedby="basic-addon1" value={booking.lastname} onChange={e => updateState(e.target)} />
				</div>
				<div className="input-group mb-3">
					<div className="input-group-prepend">
						<span className="input-group-text" id="basic-addon1"><span className="fa fa-envelope"></span></span>
					</div>
					<input type="text" className="form-control room-email" placeholder="Email" aria-label="Email" aria-describedby="basic-addon1" name="email" value={booking.email} onChange={e => updateState(e.target)} />
				</div>
				<div className="input-group mb-3">
					<div className="input-group-prepend">
						<span className="input-group-text" id="basic-addon1"><span className="fa fa-phone"></span></span>
					</div>
					<input type="text" className="form-control room-phone" placeholder="Phone" aria-label="Phone" aria-describedby="basic-addon1" name="phone" value={booking.phone} onChange={e => updateState(e.target)} />
				</div>
				<button type='button' className='btn btn-outline-danger float-right book-room' onClick={toggleBooking}>Cancel</button>
				<button type='button' className='btn btn-outline-primary float-right book-room' style={{marginRight : '10px' }} onClick={submitForm}>Book</button>
				{renderErrors}
			</div>
			<div className="col-sm-1"></div>
		</div>
	}
}

export default RoomBookingForm;
