import React from 'react';
import { Calendar, momentLocalizer } from 'react-big-calendar';
import moment from 'moment/moment';
import { API } from '../libs/Api';
import BookingConfirmation from './BookingConfirmation.jsx';

export default class RoomBookingForm extends React.Component {

    constructor(){
        super();

        this.state = {
			completed : false,
			events : [],
			newEvent : [],
			errors : [],
            booking : {
                bookingdates :	{
                    checkin : '',
                    checkout : ''
                },
                depositpaid	: false,
                firstname : '',
                lastname : '',
                roomid : null,
				email : '',
                phone : ''
            },
        }

		this.handleSelect = this.handleSelect.bind(this);
		this.submitForm = this.submitForm.bind(this);
		this.updateState = this.updateState.bind(this);
		this.closeConfirmation = this.closeConfirmation.bind(this);
	}

	componentDidMount(){
		API.getRoomReport(this);
	}

	updateState(event){
		let currentState = this.state;

		currentState.booking[event.target.name] = event.target.value;
				
		this.setState(currentState);
	}

    handleSelect(result){
		if(result.slots.length > 1){
			let currentState = this.state;

			currentState.newEvent = [
				{
					start : new Date(Date.UTC(result.start.getFullYear(), result.start.getMonth(), result.start.getDate(), result.start.getHours(), result.start.getMinutes(), result.start.getSeconds())),
					end : new Date(Date.UTC(result.end.getFullYear(), result.end.getMonth(), result.end.getDate(), result.end.getHours(), result.end.getMinutes(), result.end.getSeconds())),
					title : (result.slots.length - 1) + ' night(s) - £' + ((result.slots.length - 1) * this.props.roomPrice)
				}
			]
	
			currentState.booking.bookingdates.checkin = moment(result.start).format("YYYY-MM-DD");
			currentState.booking.bookingdates.checkout = moment(result.end).format("YYYY-MM-DD");
			
			this.setState(currentState);
		}
	}
	
	submitForm(){
		let currentState = this.state;
		currentState.booking.roomid = this.props.roomid;
		this.state = currentState;

		API.postBooking(this);
	}

	closeConfirmation(){
		this.setState({completed : false});
		this.props.toggleBooking();
    }

    render(){
		let errors;

		if(this.state.errors.length > 0){
            errors = <div className="alert alert-danger" style={{marginTop : 5 + "rem"}}>
                {this.state.errors.map((value) => {
                    return <p key={value}>{value}</p>
                })}
            </div>
        }

        const localizer = momentLocalizer(moment);
		
		const events = this.state.newEvent.concat(this.state.events);

		if(this.state.completed){
			return <BookingConfirmation booking={this.state.booking} closeConfirmation={this.closeConfirmation}/>
		} else {
			return <div className="row hotel-room-info">
				<div className="col-sm-1"></div>
				<div className="col-sm-6">
				<Calendar
					localizer={localizer}
					onSelectSlot={this.handleSelect}
					defaultView="month"
					selectable
					popup={true}
					events={events}
					style={{ height: "60vh" }}
					views={['month']}
				/>
				</div>
				<div className="col-sm-4">
					<div className="input-group mb-3 room-booking-form">
						<div className="input-group-prepend">
							<span className="input-group-text" id="basic-addon1"><span className="fa fa-id-card"></span></span>
						</div>
						<input type="text" className="form-control room-firstname" placeholder="Firstname" aria-label="Firstname" name="firstname" aria-describedby="basic-addon1" value={this.state.booking.firstname} onChange={this.updateState} />
					</div>
					<div className="input-group mb-3">
						<div className="input-group-prepend">
							<span className="input-group-text" id="basic-addon1"><span className="fa fa-id-card"></span></span>
						</div>
						<input type="text" className="form-control room-lastname" placeholder="Lastname" aria-label="Lastname" name="lastname" aria-describedby="basic-addon1" value={this.state.booking.lastname} onChange={this.updateState} />
					</div>
					<div className="input-group mb-3">
						<div className="input-group-prepend">
							<span className="input-group-text" id="basic-addon1"><span className="fa fa-envelope"></span></span>
						</div>
						<input type="text" className="form-control room-email" placeholder="Email" aria-label="Email" aria-describedby="basic-addon1" name="email" value={this.state.booking.email} onChange={this.updateState} />
					</div>
					<div className="input-group mb-3">
						<div className="input-group-prepend">
							<span className="input-group-text" id="basic-addon1"><span className="fa fa-phone"></span></span>
						</div>
						<input type="text" className="form-control room-phone" placeholder="Phone" aria-label="Phone" aria-describedby="basic-addon1" name="phone" value={this.state.booking.phone} onChange={this.updateState} />
					</div>
					<button type='button' className='btn btn-outline-danger float-right book-room' onClick={this.props.toggleBooking}>Cancel</button>
					<button type='button' className='btn btn-outline-primary float-right book-room' style={{marginRight : '10px' }} onClick={this.submitForm}>Book</button>
					{errors}
				</div>
				<div className="col-sm-1"></div>
			</div>
		}
    }
}