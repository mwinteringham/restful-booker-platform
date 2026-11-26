import React, { useEffect, useState } from 'react';
import ReactModal from 'react-modal';
import moment from 'moment';

import { Booking as BookingType } from '@/types/booking';

interface AdminBookingProps {
  closeBooking: () => void;
  dates: {
    slots: Date[];
    start: Date;
    end: Date;
  } | null;
}

interface Room {
  roomid: number;
  roomName: string;
}

const AdminBooking: React.FC<AdminBookingProps> = ({ closeBooking, dates }) => {
  const [rooms, setRooms] = useState<Room[]>([]);
  const [booking, setBooking] = useState<BookingType>({
    bookingid: 0,
    firstname: '',
    lastname: '',
    depositpaid: false,
    roomid: 0,
    bookingdates: {
      checkin: '',
      checkout: ''
    }
  });
  const [errors, setErrors] = useState<string[]>([]);

  useEffect(() => {
    if (dates) {
      const newBooking = {
        ...booking,
        bookingdates: {
          checkin: moment(dates.start).format('YYYY-MM-DD'),
          checkout: moment(dates.end).format('YYYY-MM-DD')
        }
      };
      setBooking(newBooking);
      fetchRooms();
    }
  }, []);

  const fetchRooms = async () => {
    try {
      const response = await fetch('/ui-api/room');
      if (response.ok) {
        const data = await response.json();
        setRooms(data.rooms);
      }
    } catch (error) {
      console.error('Error fetching rooms:', error);
      setErrors(['Failed to fetch rooms']);
    }
  };

  const updateState = (event: { name: string; value: string | boolean }) => {
    const value = event.name === 'depositpaid' ? event.value === 'true' : event.value;
    setBooking(prevState => ({
      ...prevState,
      [event.name]: value
    }));
  };

  const doBooking = async () => {
    try {
      const response = await fetch('/ui-api/booking', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(booking)
      });

      if (response.status === 200) {
        closeBooking();
      } else {
        const error = await response.json();
        setErrors(error.errors || ['Failed to create booking']);
      }
    } catch (error) {
      console.error('Error creating booking:', error);
      setErrors(['Failed to create booking']);
    }
  };

  let errorDetails;
  if (errors.length > 0) {
    errorDetails = (
      <div className="alert alert-danger" style={{ marginTop: '1rem' }}>
        {errors.map((value) => (
          <p key={value}>{value}</p>
        ))}
      </div>
    );
  }

  return (
    <ReactModal 
          appElement={document.getElementById('root-container') as HTMLElement}
          isOpen={true}
          contentLabel="onRequestClose Example"
          className="confirmation-modal"
          >
          
          <div className="row">
              <div className="col-6">
                  <input type="text" className="form-control" placeholder="Firstname" aria-label="Firstname" name="firstname" aria-describedby="basic-addon1" value={booking.firstname} onChange={e => updateState({ name: e.target.name, value: e.target.value })} />    
              </div>
              <div className="col-6">
              <input type="text" className="form-control" placeholder="Lastname" aria-label="Lastname" name="lastname" aria-describedby="basic-addon1" value={booking.lastname} onChange={e => updateState({ name: e.target.name, value: e.target.value })} />
              </div>
          </div>
          <div className="row room-booking-form mt-5">
              <div className="col-6">
                  <div className="input-group-prepend d-flex align-items-center">
                      <span className="input-group-text" id="basic-addon1">Room</span>
                      <select className="form-control" name="roomid" id="roomid" value={booking.roomid} onChange={e => updateState({ name: e.target.name, value: e.target.value })}>
                      <option value="0">Select room</option>
                      {rooms.map((room) => {
                          return <option key={room.roomid} value={room.roomid}>{room.roomName}</option>
                      })}
                      </select>
                  </div>
              </div>
              <div className="col-6">
                  <div className="input-group-prepend d-flex align-items-center">
                      <span className="input-group-text" id="basic-addon1">Deposit paid?</span>
                      <select className="form-control" name="depositpaid" id="depositpaid" value={booking.depositpaid.toString()} onChange={e => updateState({ name: e.target.name, value: e.target.value })}>
                          <option value="false">false</option>
                          <option value="true">true</option>
                      </select>
                  </div>
              </div>
          </div>
          <div className="row room-booking-form mt-5">
              <div className="col-6">
                  <p><span style={{fontWeight : "bold"}}>Checkin: </span>{booking.bookingdates.checkin}</p>
              </div>
              <div className="col-6">
                  <p><span style={{fontWeight : "bold"}}>Checkout: </span>{booking.bookingdates.checkout}</p>
              </div>
          </div>
          <div className="row room-booking-form">
              <div className="col-sm-12">
                  <button type='button' className='btn btn-outline-danger float-right book-room float-end' onClick={() => closeBooking()}>Cancel</button>
                  <button type='button' className='btn btn-outline-primary float-right book-room float-end' style={{marginRight : '10px' }} onClick={() => doBooking()}>Book</button>
              </div>
          </div>
          {errorDetails}
      </ReactModal>
  );
};

export default AdminBooking; 