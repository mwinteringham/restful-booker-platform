import React from 'react';
import { Link } from 'react-router-dom';
import { API_ROOT } from '../api-config';

export default class RoomListing extends React.Component {

    constructor() {
        super();

        this.deleteRoom = this.deleteRoom.bind(this);
    }

    deleteRoom(){
        fetch(API_ROOT.room + '/room/' + this.props.details.roomid, {
            method: 'DELETE',
            credentials: 'include'
        })
        .then(res => {
            if(res.status == 202){
                this.props.updateRooms();
            }
        })
    }

    render() {
        return(
            <div data-type="room" id={"room"+ this.props.details.roomid} className="row detail">
                <Link to={"/admin/room/" + this.props.details.roomid}>
                    <div className="col-sm-1"><p id={"roomNumber"+ this.props.details.roomNumber}>{this.props.details.roomNumber}</p></div>
                    <div className="col-sm-2"><p id={"type"+ this.props.details.type}>{this.props.details.type}</p></div>
                    <div className="col-sm-1"><p id={"beds"+ this.props.details.beds}>{this.props.details.beds}</p></div>
                    <div className="col-sm-1"><p id={"accessible"+ this.props.details.accessible}>{this.props.details.accessible.toString()}</p></div>
                    <div className="col-sm-6"><p id={"details"+ this.props.details.details}>{this.props.details.details}</p></div>
                </Link>
                <div className="col-sm-1">
                    <span className="glyphicon glyphicon-remove roomDelete" id={this.props.details.roomid} onClick={() => this.deleteRoom()}></span>
                </div>
            </div>
        );
    }
}