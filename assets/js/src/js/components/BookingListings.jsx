import React from 'react';
import BookingListing from './BookingListing.jsx';

import { API } from '../libs/Api.js';

export default class BookingListings extends React.Component {

    constructor(){
        super();

        this.state = {
            bookings : []
        }

        this.getBookings = this.getBookings.bind(this);
    }

    componentDidMount(){
        this.getBookings();
    }

    getBookings(){
        API.getBookingsByRoomId(this)
    }

    render(){
        return(
            <div>
                {this.state.bookings.map((booking) => {
                    return <div key={booking.bookingid}><BookingListing booking={booking} getBookings={this.getBookings} roomPrice={this.props.roomPrice} /></div>
                })}
            </div>
        )
    }

}