import React, { useEffect, useState } from 'react';
import BookingListing from './BookingListing.js';

import { API } from '../libs/Api.js';

const BookingListings = ({fetchRoomDetails, roomid, roomPrice}) => {

    const [bookings, setBookings] = useState([]);

    useEffect(() => {
        getBookings()
    }, [])

    const getBookings = () => {
        API.getBookingsByRoomId(roomid, setBookings)
    }

    return(
        <div>
            {bookings.map((booking, id) => {
                return <div key={id}><BookingListing booking={booking} getBookings={getBookings} roomPrice={roomPrice} /></div>
            })}
        </div>
    )

}

export default BookingListings