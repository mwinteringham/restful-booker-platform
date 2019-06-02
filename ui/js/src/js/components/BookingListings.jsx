import React from 'react';
import { API_ROOT } from '../api-config';
import BookingListing from './BookingListing.jsx';

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
        fetch(API_ROOT + '/booking/?roomid=' + this.props.roomid, {
            headers: {
				'Accept': 'application/json',
				'Content-Type': 'application/json'
			}
        })
        .then(res => res.json())
        .then(res => {
            this.setState(res);
        })
        .catch(e => console.log(e));
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