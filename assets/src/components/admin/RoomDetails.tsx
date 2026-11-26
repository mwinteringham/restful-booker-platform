import React, { useEffect, useState } from 'react';
import BookingListings from './BookingListings';

interface RoomDetailsProps {
  id: string;
}

interface RoomState {
  roomName?: string;
  type?: string;
  accessible: boolean;
  description: string;
  image?: string;
  roomPrice?: number;
  featuresObject: {
    WiFi: boolean;
    TV: boolean;
    Radio: boolean;
    Refreshments: boolean;
    Safe: boolean;
    Views: boolean;
  };
  features: string[];
}

const RoomDetails: React.FC<RoomDetailsProps> = ({ id }) => {
  const [edit, toggleEdit] = useState(false);
  const [room, setRoom] = useState<RoomState>({
    accessible: false,
    description: "",
    featuresObject: {
      WiFi: false,
      TV: false,
      Radio: false,
      Refreshments: false,
      Safe: false,
      Views: false
    },
    features: []
  });
  const [errors, setErrors] = useState<string[]>([]);

  useEffect(() => {
    fetchRoomDetails();
  }, [id]);

  const toggleAndRestEdit = (toggle: boolean) => {
    setErrors([]);
    toggleEdit(toggle);
  };

  const doEdit = async () => {
    // Convert feature object to array before sending
    const roomToUpdate = {
      ...room,
      features: Object.keys(room.featuresObject).filter(key => room.featuresObject[key as keyof typeof room.featuresObject])
    };

    try {
      const response = await fetch(`/ui-api/room/${id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(roomToUpdate),
      });

      if (response.ok) {
        resetForm();
        fetchRoomDetails();
      } else {
        const data = await response.json();
        setErrors(data.errors || ['Failed to update room']);
      }
    } catch (error) {
      console.error('Error updating room:', error);
      setErrors(['An unexpected error occurred']);
    }
  };

  const resetForm = () => {
    toggleEdit(false);
    setRoom({
      accessible: false,
      description: "",
      featuresObject: {
        WiFi: false,
        TV: false,
        Radio: false,
        Refreshments: false,
        Safe: false,
        Views: false
      },
      features: []
    });
    setErrors([]);
  };

  const fetchRoomDetails = async () => {
    try {
      const response = await fetch(`/ui-api/room/${id}`);
      if (response.ok) {
        const data = await response.json();
        // Convert features array to object
        const featuresObject = {
          WiFi: false,
          TV: false,
          Radio: false,
          Refreshments: false,
          Safe: false,
          Views: false
        };
        data.features?.forEach((feature: string) => {
          featuresObject[feature as keyof typeof featuresObject] = true;
        });
        setRoom({ ...data, featuresObject });
      }
    } catch (error) {
      console.error('Error fetching room details:', error);
    }
  };

  const updateState = (event: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const { id: fieldId, value, name } = event.target;
    
    if (name === 'featureCheck') {
      const checkbox = event.target as HTMLInputElement;
      setRoom(prevState => ({
        ...prevState,
        featuresObject: {
          ...prevState.featuresObject,
          [value]: checkbox.checked
        }
      }));
    } else {
      setRoom(prevState => ({
        ...prevState,
        [fieldId]: value
      }));
    }
  };

  const renderRoomSummary = () => {
    if (edit) {
      return (
        <div className="room-details">
          <div className="row">
            <div className="col-sm-9">
              <h2>Room: </h2>
              <input type="text" defaultValue={room.roomName} id="roomName" onChange={updateState} />
            </div>
            <div className="col-sm-3">
              <button onClick={() => toggleAndRestEdit(false)} type="button" id="cancelEdit" className="btn btn-outline-danger float-sm-end">Cancel</button>
              <button onClick={doEdit} type="button" id="update" className="btn btn-outline-primary float-sm-end" style={{marginRight: "10px"}}>Update</button>
            </div>
          </div>
          <div className="row">
            <div className="col-sm-6">
              <label className="editLabel" htmlFor="type">Type: </label>
              <select className="form-control" id="type" value={room.type} onChange={updateState}>
                <option value="Single">Single</option>
                <option value="Twin">Twin</option>
                <option value="Double">Double</option>
                <option value="Family">Family</option>
                <option value="Suite">Suite</option>
              </select>
              <label className="editLabel" htmlFor="accessible">Accessible: </label>
              <select className="form-control" id="accessible" value={room.accessible.toString()} onChange={updateState}>
                <option value="false">false</option>
                <option value="true">true</option>
              </select>
              <label className="editLabel" htmlFor="roomPrice">Room price: </label>
              <input className="form-control" type="text" defaultValue={room.roomPrice} id="roomPrice" onChange={updateState} />
            </div>
            <div className="col-sm-6">
              <label className="editLabel" htmlFor="description">Description: </label>
              <textarea className="form-control" aria-label="Description" defaultValue={room.description} id="description" rows={5} onChange={updateState}></textarea>
            </div>
          </div>
          <div className="row">
            <div className="col-sm-6">
              <label className="editLabel">Room features: </label>
              <div className="row">
                {Object.entries(room.featuresObject).map(([feature, checked]) => (
                  <div className="col-4" key={feature}>
                    <div className="form-check form-check-inline">
                      <input
                        className="form-check-input"
                        type="checkbox"
                        name="featureCheck"
                        id={`${feature.toLowerCase()}Checkbox`}
                        value={feature}
                        checked={checked}
                        onChange={updateState}
                      />
                      <label className="form-check-label" htmlFor={`${feature.toLowerCase()}Checkbox`}>{feature}</label>
                    </div>
                  </div>
                ))}
              </div>
            </div>
            <div className="col-sm-6">
              <label className="editLabel" htmlFor="image">Image: </label>
              <input type="text" className="form-control" defaultValue={room.image} id="image" onChange={updateState} />
            </div>
          </div>
          {errors.length > 0 && (
            <div className="alert alert-danger" style={{marginTop: "15px"}}>
              {errors.map((error) => (
                <p key={error}>{error}</p>
              ))}
            </div>
          )}
        </div>
      );
    }

    return (
      <div className="room-details">
        <div className="row">
          <div className="col-sm-10">
            <h2>Room: {room.roomName}</h2>
          </div>
          <div className="col-sm-2">
            <button onClick={() => toggleAndRestEdit(true)} type="button" className="btn btn-outline-primary float-sm-end">Edit</button>
          </div>
        </div>
        <div className="row">
          <div className="col-sm-6">
            <p>Type: <span>{room.type}</span></p>
          </div>
          <div className="col-sm-6">
            <p>Description: <span>
              {room.description && room.description.length >= 50
                ? room.description.substring(0, 50) + "..."
                : room.description}
            </span></p>
          </div>
        </div>
        <div className="row">
          <div className="col-sm-6">
            <p>Accessible: <span>{room.accessible.toString()}</span></p>
            <p>Features: <span>
              {room.features.length > 0
                ? room.features.join(", ")
                : <span style={{color: "grey"}}>No features added to the room</span>
              }
            </span></p>
            <p>Room price: <span>{room.roomPrice}</span></p>
          </div>
          <div className="col-sm-6">
            <p>Image:</p>
            <img src={room.image} alt={`Room: ${room.roomName} preview image`} />
          </div>
        </div>
      </div>
    );
  };

  return (
    <div>
      {renderRoomSummary()}
      <div className="row">
        <div className="col-sm-2 rowHeader"><p>First name</p></div>
        <div className="col-sm-2 rowHeader"><p>Last name</p></div>
        <div className="col-sm-1 rowHeader"><p>Price</p></div>
        <div className="col-sm-2 rowHeader"><p>Deposit paid?</p></div>
        <div className="col-sm-2 rowHeader"><p>Check in</p></div>
        <div className="col-sm-2 rowHeader"><p>Check out</p></div>
        <div className="col-sm-1"></div>
      </div>
      <BookingListings roomid={id} roomPrice={room.roomPrice} />
    </div>
  );
};

export default RoomDetails; 