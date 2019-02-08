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
        fetch(API_ROOT.room + '/room/' + this.props.details.roomid, {
            method: 'DELETE',
            credentials: 'include'
        })
        .then(res => {
            if(res.status == 202){
                this.props.updateRooms();
            }
        });
    }

    openRoom(){
        this.props.history.push('/admin/room/' + this.props.details.roomid);
    }

    render() {
        return(
            <div data-type="room" id={"room"+ this.props.details.roomid} className="row detail" onClick={this.openRoom}>
                <div className="col-sm-1"><p id={"roomNumber"+ this.props.details.roomNumber}>{this.props.details.roomNumber}</p></div>
                <div className="col-sm-2"><p id={"type"+ this.props.details.type}>{this.props.details.type}</p></div>
                <div className="col-sm-1"><p id={"beds"+ this.props.details.beds}>{this.props.details.beds}</p></div>
                <div className="col-sm-1"><p id={"accessible"+ this.props.details.accessible}>{this.props.details.accessible.toString()}</p></div>
                <div className="col-sm-6"><p id={"details"+ this.props.details.details}>{this.props.details.details}</p></div>
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