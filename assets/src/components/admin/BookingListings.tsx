import React, { useEffect, useState } from 'react';
import BookingListing from './BookingListing';
import { Booking } from '@/types/booking';

interface BookingListingsProps {
  roomid: string;
  roomPrice?: number;
}

const BookingListings: React.FC<BookingListingsProps> = ({ roomid, roomPrice }) => {
  const [bookings, setBookings] = useState<Booking[]>([]);

  useEffect(() => {
    if (roomid) {
      getBookings();
    }
  }, [roomid]);

  const getBookings = async () => {
    try {
      const response = await fetch(`/ui-api/booking/?roomid=${roomid}`);
      if (response.ok) {
        const data = await response.json();
        setBookings(data.bookings || []);
      }
    } catch (error) {
      console.error('Error fetching bookings:', error);
    }
  };

  return (
    <div>
      {bookings?.map((booking, id) => (
        <div key={id}>
          <BookingListing 
            booking={booking} 
            getBookings={getBookings} 
            roomPrice={roomPrice}
          />
        </div>
      ))}
    </div>
  );
};

export default BookingListings;