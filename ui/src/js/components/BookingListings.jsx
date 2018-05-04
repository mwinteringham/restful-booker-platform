import React from 'react';
import BookingListing from './BookingListing.jsx';

export default class BookingListings extends React.Component {

    constructor(){
        super();
    }

    render(){
        return(
            <div>
                {this.props.bookings.map((booking, index) => {
                    return <div key={booking.bookingid}><BookingListing booking={booking} fetchHotelDetails={this.props.fetchHotelDetails} /></div>
                })}
            </div>
        )
    }

}