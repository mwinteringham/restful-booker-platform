import React, { useState } from 'react';

interface RoomFormProps {
  updateRooms: () => void;
}

interface RoomData {
  roomName: string;
  type: string;
  accessible: boolean;
  description: string;
  image: string;
  roomPrice: string;
  features: {
    WiFi: boolean;
    TV: boolean;
    Radio: boolean;
    Refreshments: boolean;
    Safe: boolean;
    Views: boolean;
  };
}

const RoomForm: React.FC<RoomFormProps> = ({ updateRooms }) => {
  const [errors, setErrors] = useState<string[]>([]);
  const [newRoom, setNewRoom] = useState<RoomData>({
    roomName: '',
    type: 'Single',
    accessible: false,
    description: 'Please enter a description for this room',
    image: 'https://www.mwtestconsultancy.co.uk/img/room1.jpg',
    roomPrice: '',
    features: {
      WiFi: false,
      TV: false,
      Radio: false,
      Refreshments: false,
      Safe: false,
      Views: false
    }
  });

  const resetForm = () => {
    setErrors([]);
    setNewRoom({
      roomName: '',
      type: 'Single',
      accessible: false,
      description: 'Please enter a description for this room',
      image: 'https://www.mwtestconsultancy.co.uk/img/room1.jpg',
      roomPrice: '',
      features: {
        WiFi: false,
        TV: false,
        Radio: false,
        Refreshments: false,
        Safe: false,
        Views: false
      }
    });
  };

  const createRoom = async () => {
    const roomToCreate = {
      ...newRoom,
      features: Object.keys(newRoom.features).filter(key => newRoom.features[key as keyof typeof newRoom.features])
    };

    try {
      const response = await fetch('/ui-api/room', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(roomToCreate)
      });

      if (response.ok) {
        resetForm();
        updateRooms();
      } else {
        const errorData = await response.json();
        setErrors(errorData.errors);
      }
    } catch (error) {
      setErrors(['An error occurred while creating the room']);
    }
  };

  const updateState = (event: { target: { name?: string; id?: string; value: string; checked?: boolean; } }) => {
    const { name, id, value, checked } = event.target;
    
    if (name === 'featureCheck') {
      setNewRoom(prevRoom => ({
        ...prevRoom,
        features: {
          ...prevRoom.features,
          [value]: checked
        }
      }));
    } else {
      setNewRoom(prevRoom => ({
        ...prevRoom,
        [id || '']: id === 'accessible' ? value === 'true' : value
      }));
    }
  };

  const errorMessages = errors.length > 0 ? (
    <div className="alert alert-danger" style={{ marginBottom: '5rem' }}>
      {errors.map((value) => (
        <p key={value}>{value}</p>
      ))}
    </div>
  ) : null;

  return (
    <div>
      <div className="row room-form mt-2">
        <div className="col-sm-1">
          <input 
            className="form-control" 
            type="text" 
            data-testid="roomName" 
            id="roomName" 
            value={newRoom.roomName} 
            onChange={e => updateState(e)}
          />
        </div>
        <div className="col-sm-2">
          <select 
            className="form-control" 
            id="type" 
            value={newRoom.type} 
            onChange={e => updateState(e)}
          >
            <option value="Single">Single</option>
            <option value="Twin">Twin</option>
            <option value="Double">Double</option>
            <option value="Family">Family</option>
            <option value="Suite">Suite</option>
          </select>
        </div>
        <div className="col-sm-2">
          <select 
            className="form-control" 
            id="accessible" 
            value={String(newRoom.accessible)} 
            onChange={e => updateState(e)}
          >
            <option value="false">false</option>
            <option value="true">true</option>
          </select>
        </div>
        <div className="col-sm-1">
          <input 
            className="form-control" 
            type="text" 
            id="roomPrice" 
            value={newRoom.roomPrice} 
            onChange={e => updateState(e)} 
          />
        </div>
        <div className="col-sm-5">
          <div className="row">
            <div className="col-4">
              <div className="form-check form-check-inline">
                <input 
                  className="form-check-input" 
                  type="checkbox" 
                  name="featureCheck" 
                  id="wifiCheckbox" 
                  value="WiFi" 
                  checked={newRoom.features.WiFi} 
                  onChange={e => updateState(e)} 
                />
                <label className="form-check-label" htmlFor="wifiCheckbox">WiFi</label>
              </div>
            </div>
            <div className="col-4">
              <div className="form-check form-check-inline">
                <input 
                  className="form-check-input" 
                  type="checkbox" 
                  name="featureCheck" 
                  id="tvCheckbox" 
                  value="TV" 
                  checked={newRoom.features.TV} 
                  onChange={e => updateState(e)} 
                />
                <label className="form-check-label" htmlFor="tvCheckbox">TV</label>
              </div>
            </div>
            <div className="col-4">
              <div className="form-check form-check-inline">
                <input 
                  className="form-check-input" 
                  type="checkbox" 
                  name="featureCheck" 
                  id="radioCheckbox" 
                  value="Radio" 
                  checked={newRoom.features.Radio} 
                  onChange={e => updateState(e)} 
                />
                <label className="form-check-label" htmlFor="radioCheckbox">Radio</label>
              </div>
            </div>
          </div>
          <div className="row">
            <div className="col-4">
              <div className="form-check form-check-inline">
                <input 
                  className="form-check-input" 
                  type="checkbox" 
                  name="featureCheck" 
                  id="refreshCheckbox" 
                  value="Refreshments" 
                  checked={newRoom.features.Refreshments} 
                  onChange={e => updateState(e)} 
                />
                <label className="form-check-label" htmlFor="refreshCheckbox">Refreshments</label>
              </div>
            </div>
            <div className="col-4">
              <div className="form-check form-check-inline">
                <input 
                  className="form-check-input" 
                  type="checkbox" 
                  name="featureCheck" 
                  id="safeCheckbox" 
                  value="Safe" 
                  checked={newRoom.features.Safe} 
                  onChange={e => updateState(e)} 
                />
                <label className="form-check-label" htmlFor="safeCheckbox">Safe</label>
              </div>
            </div>
            <div className="col-4">
              <div className="form-check form-check-inline">
                <input 
                  className="form-check-input" 
                  type="checkbox" 
                  name="featureCheck" 
                  id="viewsCheckbox" 
                  value="Views" 
                  checked={newRoom.features.Views} 
                  onChange={e => updateState(e)} 
                />
                <label className="form-check-label" htmlFor="viewsCheckbox">Views</label>
              </div>
            </div>
          </div>
        </div>
        <div className="col-sm-1">
          <button 
            className="btn btn-outline-primary" 
            id="createRoom" 
            type="submit" 
            onClick={createRoom}
          >
            Create
          </button>
        </div>
      </div>
      {errorMessages}
    </div>
  );
}

export default RoomForm;
