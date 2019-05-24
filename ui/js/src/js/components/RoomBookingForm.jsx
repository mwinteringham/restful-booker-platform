import React from 'react';
import BigCalendar from 'react-big-calendar';
import moment from 'moment';
import { API } from '../libs/Api';

export default class RoomBookingForm extends React.Component {

    constructor(){
        super();

        this.state = {
			events : [],
			contact : {
                email : '',
                phone : '',
                subject : 'You have a new booking'
			},
            booking : {
                bookingdates :	{
                    checkin : '',
                    checkout : ''
                },
                depositpaid	: false,
                firstname : '',
                lastname : '',
                roomid : null,
                totalprice : 100
            },
        }

		this.handleSelect = this.handleSelect.bind(this);
		this.submitForm = this.submitForm.bind(this);
		this.updateState = this.updateState.bind(this);
	}

	updateState(event){
		let currentState = this.state;

		switch(event.target.name){
			case 'firstname':
				currentState.booking.firstname = event.target.value;
				break;
			case 'lastname':
				currentState.booking.lastname = event.target.value;
				break;
			case 'email':
				currentState.contact.email = event.target.value;
				break;
			case 'phone':
				currentState.contact.phone = event.target.value;
				break;
		}
		
		this.setState(currentState);
	}

    handleSelect( result ){
		let currentState = this.state;
		currentState.events = [
			{
				start : result.start,
				end : result.end,
				title : 'New booking'
			}
		]

		currentState.booking.bookingdates.checkin = result.start.toISOString().split('T')[0];
		currentState.booking.bookingdates.checkout = result.end.toISOString().split('T')[0];
		
		this.setState(currentState);
	}
	
	submitForm(){
		let currentState = this.state;
		currentState.booking.roomid = this.props.roomid;
		currentState.contact.name = currentState.booking.firstname + ' ' + currentState.booking.lastname;
		currentState.contact.description = 'A new booking has been made by ' + currentState.contact.name + ' on the following dates: ' + currentState.booking.bookingdates.checkin + ' to ' + currentState.booking.bookingdates.checkout;

		this.state = currentState;

		API.postBooking(this);
		API.postMessage(this);
	}

    render(){
        const localizer = BigCalendar.momentLocalizer(moment);

        return <div className="row hotel-room-info">
            <div className="col-sm-1"></div>
            <div className="col-sm-6">
              <BigCalendar
                  localizer={localizer}
                  onSelectSlot={this.handleSelect}
                  defaultView="month"
                  selectable
                  popup={true}
                  events={this.state.events}
                  style={{ height: "50vh" }}
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
					<input type="text" className="form-control room-email" placeholder="Email" aria-label="Email" aria-describedby="basic-addon1" name="email" value={this.state.contact.email} onChange={this.updateState} />
				</div>
				<div className="input-group mb-3">
					<div className="input-group-prepend">
						<span className="input-group-text" id="basic-addon1"><span className="fa fa-phone"></span></span>
					</div>
					<input type="text" className="form-control room-phone" placeholder="Phone" aria-label="Phone" aria-describedby="basic-addon1" name="phone" value={this.state.contact.phone} onChange={this.updateState} />
				</div>
				<button type='button' className='btn btn-outline-primary float-right' onClick={this.submitForm}>Submit</button>
            </div>
            <div className="col-sm-1"></div>
        </div>
    }
}