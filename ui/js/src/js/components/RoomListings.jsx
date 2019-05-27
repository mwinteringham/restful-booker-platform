import React from 'react';
import fetch from 'node-fetch';
import RoomListing from './RoomListing.jsx';
import RoomForm from './RoomForm.jsx';
import { API_ROOT } from '../api-config';

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
		fetch(API_ROOT + '/room/')
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
						<div className="col-sm-2 rowHeader"><p>Accessible</p></div>
						<div className="col-sm-1 rowHeader"><p>Price</p></div>
						<div className="col-sm-5 rowHeader"><p>Room details</p></div>
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