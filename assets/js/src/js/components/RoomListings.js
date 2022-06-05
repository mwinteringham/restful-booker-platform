import React, { useEffect, useState } from 'react';

import RoomListing from './RoomListing.js';
import RoomForm from './RoomForm.js';

import { API } from '../libs/Api.js';

const RoomListings = () => {

	const [rooms, setRooms] = useState([]);

	useEffect(() => {
		updateRooms();
	}, [])

	const updateRooms = () => {
		API.getRoom(setRooms);
	}

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
			{rooms.map((room, id) => {
				return <div key={id}><RoomListing details={room} updateRooms={updateRooms} /></div>
			})}
			<RoomForm updateRooms={updateRooms}/>
		</div>
	);
}

export default RoomListings;
