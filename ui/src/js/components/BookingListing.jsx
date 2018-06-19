import React from 'react';
import DatePicker from 'react-datepicker';
import moment from 'moment';
import { API_ROOT } from '../api-config';

export default class BookingListing extends React.Component {

    constructor(){
        super();

        this.state = {
            allowEdit : false,
            booking : {}
        }

        this.doDelete = this.doDelete.bind(this);
        this.enableEdit = this.enableEdit.bind(this);
        this.disableEdit = this.disableEdit.bind(this);
        this.handleStartChange = this.handleStartChange.bind(this);
        this.handleEndChange = this.handleEndChange.bind(this);
        this.doEdit = this.doEdit.bind(this);
    }

    componentDidMount(){
        this.setState({
            booking : this.props.booking
        })
    }

    doDelete(){
        fetch(API_ROOT.booking + '/booking/' + this.props.booking.bookingid, {
			method: 'DELETE',
			credentials: 'include',
        })
        .then(res => {
            if(res.status == 202){
                this.props.fetchHotelDetails();
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
        fetch(API_ROOT.auth + '/booking/' + this.props.booking.bookingid, {
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
            this.props.fetchHotelDetails();
        })
        .catch(e => console.log(e));
    }

    handleStartChange(date) {
        this.setState({
            booking : {
                bookingdates: {
                    checkin : date,
                    checkout : this.state.booking.bookingdates.checkout
                }
            }
        });
    }

    handleEndChange(date) {
        this.setState({
            booking : {
                bookingdates: {
                    checkin : this.state.booking.bookingdates.checkin,
                    checkout : date
                }
            }
        });
    }

    render(){
        let booking = null;

        if(this.state.allowEdit){
            booking = <div>
                        <div className="col-sm-2"><input type="text" defaultValue={this.props.booking.firstname} onChange={val => this.state.booking.firstname = val.target.value} /></div>
                        <div className="col-sm-2"><input type="text" defaultValue={this.props.booking.lastname} onChange={val => this.state.booking.lastname = val.target.value} /></div>
                        <div className="col-sm-1"><input type="text" defaultValue={this.props.booking.totalprice} onChange={val => this.state.booking.totalprice = val.target.value} /></div>
                        <div className="col-sm-2">
                            <select defaultValue={this.props.booking.depositpaid} onChange={val => this.state.depositpaid = val.target.value}>
                                <option value="false">false</option>
                                <option value="true">true</option>
                            </select>
                        </div>
                        <div className="col-sm-2"><DatePicker selected={moment(this.state.booking.bookingdates.checkin)} onChange={this.handleStartChange} dateFormat="YYYY-MM-DD" /></div>
                        <div className="col-sm-2"><DatePicker selected={moment(this.state.booking.bookingdates.checkout)} onChange={this.handleEndChange} dateFormat="YYYY-MM-DD" /></div>
                        <div className="col-sm-1">
                            <span className="glyphicon glyphicon-ok confirmBookingEdit" onClick={this.doEdit} style={{paddingRight : 10 + "px"}}></span>
                            <span className="glyphicon glyphicon-remove exitBookingEdit" onClick={this.disableEdit}></span>
                        </div>
                    </div>
        } else {
            booking = <div>
                        <div className="col-sm-2"><p>{this.props.booking.firstname}</p></div>
                        <div className="col-sm-2"><p>{this.props.booking.lastname}</p></div>
                        <div className="col-sm-1"><p>{this.props.booking.totalprice}</p></div>
                        <div className="col-sm-2"><p>{String(this.props.booking.depositpaid)}</p></div>
                        <div className="col-sm-2"><p>{this.props.booking.bookingdates.checkin.split('T')[0]}</p></div>
                        <div className="col-sm-2"><p>{this.props.booking.bookingdates.checkout.split('T')[0]}</p></div>
                        <div className="col-sm-1">
                            <span className="glyphicon glyphicon-pencil bookingEdit" onClick={this.enableEdit} style={{paddingRight: 10 + "px"}}></span>
                            <span className="glyphicon glyphicon-trash bookingDelete" onClick={this.doDelete}></span>
                        </div>
                      </div>
        }

        return(
            <div className={"row detail booking-" + this.props.booking.hotelid}>
                {booking}
            </div>
        )
    }

}