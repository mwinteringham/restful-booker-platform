import React from 'react';
import BookingListing from './BookingListing.jsx';
import DatePicker from 'react-datepicker';
import moment from 'moment';

import 'react-datepicker/dist/react-datepicker.css';

export default class BookingListings extends React.Component {

    constructor(){
        super();

        this.state = {
            hotelid: null,
            firstname: "",
            lastname: "",
            totalprice: "",
            depositpaid: "",
            bookingdates: {
                checkin: moment(),
                checkout: moment()
            }
        };

        this.handleStartChange = this.handleStartChange.bind(this);
        this.handleEndChange = this.handleEndChange.bind(this);
        this.createBooking = this.createBooking.bind(this);
    }

    componentDidMount(){
        this.setState({hotelid : this.props.hotelid });
    }

    handleStartChange(date) {
        this.setState({
            bookingdates: {
                checkin : date,
                checkout : this.state.bookingdates.checkout
            }
        });
    }

    handleEndChange(date) {
        this.setState({
            bookingdates: {
                checkin : this.state.bookingdates.checkin,
                checkout : date
            }
        });
    }

    createBooking() {
        fetch('http://localhost:3000/booking', {
			method: 'POST',
			headers: {
				'Accept': 'application/json',
				'Content-Type': 'application/json'
			},
			credentials: 'include',
			body : JSON.stringify(this.state)
        })
        .then(res => {
            if(res.status == 200){
                this.props.fetchHotelDetails();

                document.getElementById("firstname").value = '';
                document.getElementById("lastname").value = '';
                document.getElementById("totalprice").value = '';
                document.getElementById("depositpaid").value = 'false';
                this.setState({
                    bookingdates: {
                        checkin : moment(),
                        checkout : moment()
                    }
                })
            }
        })
        .catch(e => console.log(e))
    }

    render(){
        let form = null;

        if(this.props.isAuthenticated){
            form = <div className="row">
                    <div className="col-sm-2"><input type="text" id="firstname" onChange={val => this.state.firstname = val.target.value} /></div>
                    <div className="col-sm-2"><input type="text" id="lastname" onChange={val => this.state.lastname = val.target.value}/></div>
                    <div className="col-sm-1"><input type="text" id="totalprice" onChange={val => this.state.totalprice = val.target.value} /></div>
                    <div className="col-sm-2">
                        <select id="depositpaid" onChange={val => this.state.depositpaid = val.target.value} >
                            <option value="false">false</option>
                            <option value="true">true</option>
                        </select>
                    </div>
                    <div className="col-sm-2"><DatePicker onChange={this.handleStartChange} dateFormat="YYYY-MM-DD" /></div>
                    <div className="col-sm-2"><DatePicker onChange={this.handleEndChange} dateFormat="YYYY-MM-DD" /></div>
                    <div className="col-sm-1"><input type="button" id="createBooking" value="Create" onClick={this.createBooking}/></div>
                  </div>
        }

        return(
            <div>
                <div className="row">
                    <div className="col-sm-2 rowHeader"><p>First name</p></div>
                    <div className="col-sm-2 rowHeader"><p>Last name</p></div>
                    <div className="col-sm-1 rowHeader"><p>Price</p></div>
                    <div className="col-sm-2 rowHeader"><p>Deposit paid?</p></div>
                    <div className="col-sm-2 rowHeader"><p>Check in</p></div>
                    <div className="col-sm-2 rowHeader"><p>Check out</p></div>
                    <div className="col-sm-1"></div>
                </div>
                {this.props.bookings.map((booking, index) => {
                    return <div key={booking.bookingid}><BookingListing booking={booking} isAuthenticated={this.props.isAuthenticated} fetchHotelDetails={this.fetchHotelDetails} /></div>
                })}
                {form}
            </div>
        )
    }

}