import React, { useEffect, useState } from 'react';
import ReactModal from 'react-modal';
import { Branding as BrandingType } from '@/types/branding';

const Branding: React.FC = () => {
  const [branding, setBranding] = useState<BrandingType>({
    map: {
      latitude: 0,
      longitude: 0
    },
    directions: '',
    logoUrl: '',
    description: '',
    name: '',
    contact: {
      name: '',
      phone: '',
      email: ''
    },
    address: {
      line1: '',
      line2: '',
      postTown: '',
      county: '',
      postCode: ''
    }
  });
  const [showModal, toggleModal] = useState(false);
  const [errors, setErrors] = useState<string[]>([]);

  useEffect(() => {
    const fetchBranding = async () => {
      try {
        const response = await fetch('/ui-api/branding', {
          cache: 'force-cache'
        });
        if (response.ok) {
          const data = await response.json();
          setBranding(data);
        }
      } catch (error) {
        console.error('Error fetching branding:', error);
      }
    };

    fetchBranding();
  }, []);

  const doUpdate = async () => {
    try {
      const response = await fetch('/ui-api/branding', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(branding),
      });

      if (response.ok) {
        toggleModal(true);
        setErrors([]);
      } else {
        const data = await response.json();
        setErrors(data.fieldErrors || ['Failed to update branding']);
      }
    } catch (error) {
      console.error('Error updating branding:', error);
      setErrors(['An unexpected error occurred']);
    }
  };

  const updateState = (event: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { id, value } = event.target;

    setBranding(prevState => {
      const newState = { ...prevState };

      switch (id) {
        case 'latitude':
          newState.map.latitude = parseFloat(value) || 0;
          break;
        case 'longitude':
          newState.map.longitude = parseFloat(value) || 0;
          break;
        case 'contactName':
          newState.contact.name = value;
          break;
        case 'contactPhone':
          newState.contact.phone = value;
          break;
        case 'contactEmail':
          newState.contact.email = value;
          break;
        case 'line1':
          newState.address.line1 = value;
          break;
        case 'line2':
          newState.address.line2 = value;
          break;
        case 'postTown':
          newState.address.postTown = value;
          break;
        case 'county':
          newState.address.county = value;
          break;
        case 'postCode':
          newState.address.postCode = value;
          break;
        default:
          (newState as any)[id] = value;
          break;
      }

      return newState;
    });
  };

  return (
    <div className="branding-form">
      <h2>B&amp;B details</h2>
      <div className="input-group mb-3">
        <div className="input-group-prepend d-flex align-items-center">
          <span className="input-group-text">Name</span>
        </div>
        <input 
          type="text" 
          className="form-control" 
          id="name" 
          value={branding.name} 
          onChange={updateState} 
          placeholder="Enter B&amp;B name" 
        />
      </div>
      <div className="input-group mb-3">
        <div className="input-group-prepend d-flex align-items-center">
          <span className="input-group-text">Logo</span>
        </div>
        <input 
          type="text" 
          className="form-control" 
          id="logoUrl" 
          value={branding.logoUrl} 
          onChange={updateState} 
          placeholder="Enter image url" 
        />
      </div>
      <div className="input-group mb-3">
        <div className="input-group-prepend d-flex align-items-stretch">
          <span className="input-group-text">Description</span>
        </div>
        <textarea 
          className="form-control" 
          value={branding.description} 
          onChange={updateState} 
          id="description" 
          rows={5}
        ></textarea>
      </div>
      <br />
      <h2>Map details</h2>
      <div className="input-group mb-3">
        <div className="input-group-prepend d-flex align-items-center">
          <span className="input-group-text">Latitude</span>
        </div>
        <input 
          type="text" 
          className="form-control" 
          id="latitude" 
          value={branding.map.latitude} 
          onChange={updateState} 
          placeholder="Enter Latitude" 
        />
      </div>
      <div className="input-group mb-3">
        <div className="input-group-prepend d-flex align-items-center">
          <span className="input-group-text">Longitude</span>
        </div>
        <input 
          type="text" 
          className="form-control" 
          id="longitude" 
          value={branding.map.longitude} 
          onChange={updateState} 
          placeholder="Enter Longitude" 
        />
      </div>
      <div className="input-group mb-3">
        <div className="input-group-prepend d-flex align-items-stretch">
          <span className="input-group-text">Directions</span>
        </div>
        <textarea 
          className="form-control" 
          value={branding.directions} 
          onChange={updateState} 
          id="directions" 
          rows={5}
        ></textarea>
      </div>
      <br />
      <h2>Contact details</h2>
      <div className="input-group mb-3">
        <div className="input-group-prepend d-flex align-items-center">
          <span className="input-group-text">Name</span>
        </div>
        <input 
          type="text" 
          className="form-control" 
          id="contactName" 
          value={branding.contact.name} 
          onChange={updateState} 
          placeholder="Enter Contact Name" 
        />
      </div>
      <div className="input-group mb-3">
        <div className="input-group-prepend d-flex align-items-center">
          <span className="input-group-text">Phone</span>
        </div>
        <input 
          type="text" 
          className="form-control" 
          id="contactPhone" 
          value={branding.contact.phone} 
          onChange={updateState} 
          placeholder="Enter Phone Number" 
        />
      </div>
      <div className="input-group mb-3">
        <div className="input-group-prepend d-flex align-items-center">
          <span className="input-group-text">Email</span>
        </div>
        <input 
          type="email" 
          className="form-control" 
          id="contactEmail" 
          value={branding.contact.email} 
          onChange={updateState} 
          placeholder="Enter Email Address" 
        />
      </div>
      <br />
      <h2>Address details</h2>
      <div className="input-group mb-3">
        <div className="input-group-prepend d-flex align-items-center">
          <span className="input-group-text">Line 1</span>
        </div>
        <input
          type="text"
          className="form-control"
          id="line1"
          value={branding.address.line1}
          onChange={updateState}
          placeholder="Enter Address Line 1" />
      </div>
      <div className="input-group mb-3">
        <div className="input-group-prepend d-flex align-items-center">
          <span className="input-group-text">Line 2</span>
        </div>
        <input
          type="text"
          className="form-control"
          id="line2"
          value={branding.address.line2}
          onChange={updateState}
          placeholder="Enter Address Line 2" />
      </div>
      <div className="input-group mb-3">
        <div className="input-group-prepend d-flex align-items-center">
          <span className="input-group-text">Post Town</span>
        </div>
        <input
          type="text"
          className="form-control"
          id="postTown"
          value={branding.address.postTown}
          onChange={updateState}
          placeholder="Enter Post Town" />
      </div>
      <div className="input-group mb-3">
        <div className="input-group-prepend d-flex align-items-center">
          <span className="input-group-text">County</span>
        </div>
        <input
          type="text"
          className="form-control"
          id="county"
          value={branding.address.county}
          onChange={updateState}
          placeholder="Enter County" />
      </div>
      <div className="input-group mb-3">
        <div className="input-group-prepend d-flex align-items-center">
          <span className="input-group-text">Post Code</span>
        </div>
        <input
          type="text"
          className="form-control"
          id="postCode"
          value={branding.address.postCode}
          onChange={updateState}
          placeholder="Enter Post Code" />
      </div>
      <br />
      <button 
        type="submit" 
        id="updateBranding" 
        className="btn btn-outline-primary" 
        onClick={doUpdate}
      >
        Submit
      </button>
      
      <ReactModal 
        isOpen={showModal}
        contentLabel="onRequestClose Example"
        onRequestClose={() => toggleModal(false)}
        className="Modal"
      >
        <div className="form-row text-center">
          <div className="col-12">
            <p>Branding updated!</p>
            <button 
              className="btn btn-outline-primary" 
              onClick={() => toggleModal(false)}
            >
              Close
            </button>
          </div>
        </div>
      </ReactModal>

      {errors.length > 0 && (
        <div className="alert alert-danger" style={{ marginTop: "1rem" }}>
          {errors.map((error) => (
            <p key={error}>{error}</p>
          ))}
        </div>
      )}
    </div>
  );
};

export default Branding;