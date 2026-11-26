import React from 'react';

import { Room } from '@/types/room';

interface RoomListingProps {
  details: Room;
  updateRooms: () => void;
}

const RoomListing: React.FC<RoomListingProps> = ({details, updateRooms}) => {
    const deleteRoom = async () => {
        try {
            const response = await fetch(`/ui-api/room/${details.roomid}`, {
                method: 'DELETE'
            });
            
            if (response.ok) {
                updateRooms();
            }
        } catch (error) {
            console.error('Error deleting room:', error);
        }
    }

    const openRoom = () => {
        window.location.href = `/admin/room/${details.roomid}`;
    }
    
    return(
        <div data-testid="roomlisting" data-type="room" id={"room"+ details.roomid} className="row detail">
            <div onClick={openRoom} className="col-sm-1"><p id={"roomName"+ details.roomName}>{details.roomName}</p></div>
            <div onClick={openRoom} className="col-sm-2"><p id={"type"+ details.type}>{details.type}</p></div>
            <div onClick={openRoom} className="col-sm-2"><p id={"accessible"+ details.accessible}>{details.accessible.toString()}</p></div>
            <div onClick={openRoom} className="col-sm-1"><p id={"roomPrice"+ details.roomPrice}>{details.roomPrice}</p></div>
            <div onClick={openRoom} className="col-sm-5">
                <p id={"details"+ details.features}>
                    {details.features.length > 0 &&
                        details.features.map((value, index) => {
                            if(index + 1 === details.features.length){
                                return value;
                            } else {
                                return value + ", ";
                            }
                        })
                    }
                    {details.features.length === 0 && 
                        <span style={{color: "grey"}}>No features added to the room</span>
                    }
                </p>
            </div>
            <div className="col-sm-1">
                <span className="fa fa-remove roomDelete" id={details.roomid.toString()} onClick={deleteRoom}></span>
            </div>
        </div>
    );
}

export default RoomListing;
