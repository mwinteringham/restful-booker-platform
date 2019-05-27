import React from 'react';
import { withRouter } from 'react-router-dom';
import { API_ROOT } from '../api-config';
import PropTypes from 'prop-types';

class RoomListing extends React.Component {

    constructor() {
        super();

        this.deleteRoom = this.deleteRoom.bind(this);
        this.openRoom = this.openRoom.bind(this);
    }

    deleteRoom(){
        fetch(API_ROOT + '/booking/?roomid=' + this.props.details.roomid, {
            method: 'GET'
        })
        .then(res => res.json())
        .then(res => {
            for(let i = 0; i < res.bookings.length; i++){
                fetch(API_ROOT + '/booking/' + res.bookings[i].bookingid, {
                    method: 'DELETE'
                });
            }

            fetch(API_ROOT + '/room/' + this.props.details.roomid, {
                method: 'DELETE',
                credentials: 'include'
            })
            .then(res => {
                if(res.status == 202){
                    this.props.updateRooms();
                }
            });
        })
    }

    openRoom(){
        this.props.history.push('/admin/room/' + this.props.details.roomid);
    }

    render() {
        return(
            <div data-type="room" id={"room"+ this.props.details.roomid} className="row detail" >
                <div onClick={this.openRoom} className="col-sm-1"><p id={"roomNumber"+ this.props.details.roomNumber}>{this.props.details.roomNumber}</p></div>
                <div onClick={this.openRoom} className="col-sm-2"><p id={"type"+ this.props.details.type}>{this.props.details.type}</p></div>
                <div onClick={this.openRoom} className="col-sm-2"><p id={"accessible"+ this.props.details.accessible}>{this.props.details.accessible.toString()}</p></div>
                <div onClick={this.openRoom} className="col-sm-1"><p id={"roomPrice"+ this.props.details.roomPrice}>{this.props.details.roomPrice}</p></div>
                <div onClick={this.openRoom} className="col-sm-5">
                    <p id={"details"+ this.props.details.features}>
                        {this.props.details.features.length > 0 &&
                            this.props.details.features.map((value, index) => {
                                if(index + 1 === this.props.details.features.length){
                                    return value;
                                } else {
                                    return value + ", ";
                                }
                            })
                        }
                        {this.props.details.features.length === 0 && 
                            <span style={{color : "grey"}}>No features added to the room</span>
                        }
                    </p>
                </div>
                <div className="col-sm-1">
                    <span className="fa fa-remove roomDelete" id={this.props.details.roomid} onClick={() => this.deleteRoom()}></span>
                </div>
            </div>
        );
    }
}

RoomListing.propTypes = {
	match: PropTypes.object.isRequired,
	location: PropTypes.object.isRequired,
	history: PropTypes.object.isRequired
}

export default withRouter(RoomListing);