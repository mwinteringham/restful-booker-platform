import React from 'react';
import fetch from 'node-fetch';
import RoomListing from './RoomListing.jsx';
import RoomForm from './RoomForm.jsx';

export default class RoomListings extends React.Component {

  constructor() {
        super();
		this.state = {
			rooms : []
		};
		
		this.updateRooms = this.updateRooms.bind(this);
  }
    
	componentDidMount() {
		this.updateRooms();
	}

	updateRooms() {
		fetch('http://' + window.location.hostname + ':3001/room')
			.then(res => res.json())
			.then(body => {
				this.setState({rooms : body.rooms});
			});
	}

    render() {	  
		return(
			<div>
				<div className="row">
					<div className="col-sm-1 rowHeader"><p>Room #</p></div>
					<div className="col-sm-2 rowHeader"><p>Type</p></div>
					<div className="col-sm-1 rowHeader"><p>Beds</p></div>
					<div className="col-sm-1 rowHeader"><p>Accessible</p></div>
					<div className="col-sm-6 rowHeader"><p>Room details</p></div>
					<div className="col-sm-1"></div>
				</div>
				{this.state.rooms.map((room) => {
					return <div key={room.roomid}><RoomListing details={room} updateRooms={this.updateRooms} /></div>
				})}
				<RoomForm updateRooms={this.updateRooms}/>
			</div>
		);
    }
  }