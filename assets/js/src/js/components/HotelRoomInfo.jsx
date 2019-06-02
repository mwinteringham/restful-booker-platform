import React from 'react';
import RoomBookingForm from './RoomBookingForm.jsx';

export default class HotelRoomInfo extends React.Component {

    constructor(){
        super();

        this.state = {
            book : false
        }

        this.toggleBooking = this.toggleBooking.bind(this);
    }

    toggleBooking(){
        if(this.state.book){
            this.setState({book : false})
        } else {
            this.setState({book : true})
        }
    }

    render(){
        let bookRoomView;
        let button;

        if(this.state.book){
            bookRoomView = <RoomBookingForm roomid={this.props.room.roomid} roomPrice={this.props.room.roomPrice} toggleBooking={this.toggleBooking} />
        } else {
            button = <button type='button' className='btn btn-outline-primary float-right openBooking' onClick={this.toggleBooking}>Book this room</button>
        }

        return(
            <div>
                <div className="row hotel-room-info">
                    <div className="col-sm-1"></div>
                    <div className="col-sm-3">
                        <img className="img-responsive hotel-img" src={this.props.room.image} alt={"Preview image of room" + this.props.room.roomNumber} />
                    </div>
                    <div className="col-sm-7">
                        {this.props.room.accessible && <span className="fa fa-wheelchair wheelchair"></span>}
                        <h3>{this.props.room.type}</h3>
                        <p>{this.props.room.description}</p>
                        <ul>
                            {this.props.room.features.map((feature, index) => {
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

}