import React, { useState } from 'react';
import RoomBookingForm from './RoomBookingForm.js';

const HotelRoomInfo = ({roomDetails}) => {

    const [book, toggleBook] = useState(false);

    const toggleBooking = () => {
        if(book){
            toggleBook(false)
        } else {
            toggleBook(true)
        }
    }

    let bookRoomView;
    let button;

    if(book){
        bookRoomView = <RoomBookingForm roomid={roomDetails.roomid} roomPrice={roomDetails.roomPrice} toggleBooking={toggleBooking} />
    } else {
        button = <button type='button' className='btn btn-outline-primary float-right openBooking' onClick={toggleBooking}>Book this room</button>
    }

    return(
        <div>
            <div className="row hotel-room-info">
                <div className="col-sm-1"></div>
                <div className="col-sm-3">
                    <img className="img-responsive hotel-img" src={roomDetails.image} alt={"Preview image of room" + roomDetails.roomName} />
                </div>
                <div className="col-sm-7">
                    {roomDetails.accessible && <span className="fa fa-wheelchair wheelchair"></span>}
                    <h3>{roomDetails.type}</h3>
                    <p>{roomDetails.description}</p>
                    <ul>
                        {roomDetails.features.map((feature, index) => {
                            return <li key={index}>{feature}</li>
                        })}
                    </ul>
                    {button}
                </div>
                <div className="col-sm-1"></div>
            </div>
            {bookRoomView}
        </div>
    )

}

export default HotelRoomInfo;