import React, { useEffect, useState } from 'react';
import RoomListing from './RoomListing';
import RoomForm from './RoomForm';

import { Room } from '@/types/room';

const RoomListings: React.FC = () => {
  const [rooms, setRooms] = useState<Room[]>([]);

  useEffect(() => {
    updateRooms();
  }, [])

  const updateRooms = async () => {
    try {
      const response = await fetch('/ui-api/room');
      if (response.ok) {
        const data = await response.json();
        setRooms(data.rooms || []);
      }
    } catch (error) {
      console.error('Error fetching rooms:', error);
    }
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