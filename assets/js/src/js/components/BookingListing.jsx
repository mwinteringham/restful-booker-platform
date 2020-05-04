import React from 'react';
import DatePicker from 'react-datepicker';
import moment from 'moment/moment';
import { API_ROOT } from '../api-config';

import "react-datepicker/dist/react-datepicker.css";

export default class BookingListing extends React.Component {

    constructor(props){
        super(props);

        this.state = {
            allowEdit : false,
            totalPrice : 0,
            booking : {}
        }

        this.doDelete = this.doDelete.bind(this);
        this.enableEdit = this.enableEdit.bind(this);
        this.disableEdit = this.disableEdit.bind(this);
        this.handleStartChange = this.handleStartChange.bind(this);
        this.handleEndChange = this.handleEndChange.bind(this);
        this.doEdit = this.doEdit.bind(this);
        this.updateState = this.updateState.bind(this);
    }

    componentDidMount(){
        this.setState({
            booking : this.props.booking
        });
    }

    doDelete(){
        fetch(API_ROOT + '/booking/' + this.props.booking.bookingid, {
			method: 'DELETE',
			credentials: 'include',
        })
        .then(res => {
            if(res.status == 202){
                this.props.getBookings();
            }
        })
        .catch(e => console.log(e))
    }

    enableEdit(){
        this.setState({ allowEdit : true });
    }

    disableEdit(){
        this.setState({ allowEdit : false });
    }

    doEdit(){
        fetch(API_ROOT + '/booking/' + this.props.booking.bookingid, {
			method: 'PUT',
			headers: {
				'Accept': 'application/json',
				'Content-Type': 'application/json'
			},
            credentials: 'include',
            body : JSON.stringify(this.state.booking)
        })
        .then(res => res.json())
        .then(res => {
            this.setState({allowEdit : false});
            this.props.getBookings();
        })
        .catch(e => console.log(e));
    }

    handleStartChange(date) {
        let currentState = this.state;

        currentState.booking.bookingdates.checkin = moment(date.toUTCString()).format("YYYY-MM-DD");;

        this.setState(currentState);
    }

    handleEndChange(date) {
        let currentState = this.state;

        currentState.booking.bookingdates.checkout = moment(date.toUTCString()).format("YYYY-MM-DD");;

        this.setState(currentState);
    }

    updateState(event) {
        let currentState = this.state;

        currentState.booking[event.target.name] = event.target.value;

        this.setState(currentState);
    }

    render(){
        let totalPrice;
        if(this.props.roomPrice && this.state.booking.bookingdates){
            totalPrice = this.props.roomPrice * Math.round(Math.abs((new Date(this.state.booking.bookingdates.checkin).getTime() - new Date(this.state.booking.bookingdates.checkout).getTime())/(24*60*60*1000)));
        } else {
            totalPrice = 0;
        }
        
        let booking = null;

        if(this.state.allowEdit){
            booking = <div className="row">
                        <div className="col-sm-2"><input type="text" className="form-control" name="firstname" defaultValue={this.props.booking.firstname} onChange={this.updateState} /></div>
                        <div className="col-sm-2"><input type="text" className="form-control" name="lastname" defaultValue={this.props.booking.lastname} onChange={this.updateState} /></div>
                        <div className="col-sm-1"><p>{totalPrice}</p></div>
                        <div className="col-sm-2">
                            <select className="form-control" defaultValue={this.props.booking.depositpaid} name="depositpaid" onChange={this.updateState}>
                                <option value="false">false</option>
                                <option value="true">true</option>
                            </select>
                        </div>
                        <div className="col-sm-2"><DatePicker className="form-control" selected={moment(this.state.booking.bookingdates.checkin).utc(true).toDate()} onChange={this.handleStartChange} dateFormat="yyyy-MM-dd" /></div>
                        <div className="col-sm-2"><DatePicker className="form-control" selected={moment(this.state.booking.bookingdates.checkout).utc(true).toDate()} onChange={this.handleEndChange} dateFormat="yyyy-MM-dd" /></div>
                        <div className="col-sm-1">
                            <span className="fa fa-check confirmBookingEdit" onClick={this.doEdit} style={{paddingRight : 10 + "px"}}></span>
                            <span className="fa fa-remove exitBookingEdit" onClick={this.disableEdit}></span>
                        </div>
                    </div>
        } else {
            booking = <div className="row">
                        <div className="col-sm-2"><p>{this.props.booking.firstname}</p></div>
                        <div className="col-sm-2"><p>{this.props.booking.lastname}</p></div>
                        <div className="col-sm-1"><p>{totalPrice}</p></div>
                        <div className="col-sm-2"><p>{String(this.props.booking.depositpaid)}</p></div>
                        <div className="col-sm-2"><p>{this.props.booking.bookingdates.checkin.split('T')[0]}</p></div>
                        <div className="col-sm-2"><p>{this.props.booking.bookingdates.checkout.split('T')[0]}</p></div>
                        <div className="col-sm-1">
                            <span className="fa fa-pencil bookingEdit" onClick={this.enableEdit} style={{paddingRight: 10 + "px"}}></span>
                            <span className="fa fa-trash bookingDelete" onClick={this.doDelete}></span>
                        </div>
                      </div>
        }

        return(
            <div className={"detail booking-" + this.props.booking.roomid}>
                {booking}
            </div>
        )
    }

}