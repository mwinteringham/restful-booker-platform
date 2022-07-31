import React, { useEffect, useState } from 'react';
import { API } from '../libs/Api.js';
import ReactModal from 'react-modal';

const Branding = () => {
    
    const [branding, setBranding] = useState({
        map: {
            latitude: 0,
            longitude: 0
        },
        logoUrl: '',
        description: '',
        name: '',
        contact: {
            name: '',
            address: '',
            phone: '',
            email: ''
        }
    })
    const [showModal, toggleModal] = useState(false);
    const [errors, setErrors] = useState([]);

    useEffect(() => {
        API.getBranding(setBranding);
    }, [])

    const doUpdate = () => {
        API.putBranding(branding, setErrors, toggleModal);
    }

    const updateState = (event) => {
        switch(event.id){
            case 'latitude':
                branding.map.latitude = event.value;
                break;
            case 'longitude':
                branding.map.longitude = event.value;
                break;
            case 'contactName':
                branding.contact.name = event.value;
                break;
            case 'contactAddress':
                branding.contact.address = event.value;
                break;
            case 'contactPhone':
                branding.contact.phone = event.value;
                break;
            case 'contactEmail':
                branding.contact.email = event.value;
                break;
            default :
                branding[event.id] = event.value;
                break;
        }

        setBranding(prevState => ({
            ...prevState
        }));
    }


    let errorMessages = '';
    
    if(errors.length > 0){
        errorMessages = <div className="alert alert-danger" style={{marginTop : 1 + "rem"}}>
            {errors.map((value) => {
                return <p key={value}>{value}</p>
            })}
        </div>
    }

    return <div className="branding-form">
                <h2>B&amp;B details</h2>
                <div className="input-group mb-3">
                    <div className="input-group-prepend">
                        <span className="input-group-text">Name</span>
                    </div>
                    <input type="text" className="form-control" id="name" value={branding.name} onChange={e => updateState(e.target)} placeholder="Enter B&amp;B name" />
                </div>
                <div className="input-group mb-3">
                    <div className="input-group-prepend">
                        <span className="input-group-text">Logo</span>
                    </div>
                    <input type="text" className="form-control" id="logoUrl" value={branding.logoUrl} onChange={e => updateState(e.target)} placeholder="Enter image url" />
                </div>
                <div className="input-group">
                    <div className="input-group-prepend">
                        <span className="input-group-text">Description</span>
                    </div>
                    <textarea className="form-control" value={branding.description} onChange={e => updateState(e.target)} id="description" rows="5"></textarea>
                </div>
                <br />
                <h2>Map details</h2>
                <div className="input-group mb-3">
                    <div className="input-group-prepend">
                        <span className="input-group-text">Latitude</span>
                    </div>
                    <input type="text" className="form-control" id="latitude" value={branding.map.latitude} onChange={e => updateState(e.target)} placeholder="Enter Latitude" />
                </div>
                <div className="input-group mb-3">
                    <div className="input-group-prepend">
                        <span className="input-group-text">Longitude</span>
                    </div>
                    <input type="text" className="form-control" id="longitude" value={branding.map.longitude} onChange={e => updateState(e.target)} placeholder="Enter Longitude" />
                </div>
                <br />
                <h2>Contact details</h2>
                <div className="input-group mb-3">
                    <div className="input-group-prepend">
                        <span className="input-group-text">Name</span>
                    </div>
                    <input type="text" className="form-control" id="contactName" value={branding.contact.name} onChange={e => updateState(e.target)} placeholder="Enter Contact Name" />
                </div>
                <div className="input-group mb-3">
                    <div className="input-group-prepend">
                        <span className="input-group-text">Address</span>
                    </div>
                    <input type="text" className="form-control" id="contactAddress" value={branding.contact.address} onChange={e => updateState(e.target)} placeholder="Enter Address" />
                </div>
                <div className="input-group mb-3">
                    <div className="input-group-prepend">
                        <span className="input-group-text">Phone</span>
                    </div>
                    <input type="text" className="form-control" id="contactPhone" value={branding.contact.phone} onChange={e => updateState(e.target)} placeholder="Enter Phone Number" />
                </div>
                <div className="input-group mb-3">
                    <div className="input-group-prepend">
                        <span className="input-group-text">Email</span>
                    </div>
                    <input type="email" className="form-control" id="contactEmail" value={branding.contact.email} onChange={e => updateState(e.target)} placeholder="Enter Email Address" />
                </div>
                <button type="submit" id="updateBranding" className="btn btn-outline-primary" onClick={doUpdate}>Submit</button>
                <ReactModal 
                    isOpen={showModal}
                    contentLabel="onRequestClose Example"
                    onRequestClose={() => {toggleModal(false)}}
                    className="Modal"
                    >
                    
                    <div className="form-row text-center">
                        <div className="col-12">
                            <p>Branding updated!</p>
                            <button className="btn btn-outline-primary" onClick={() => {toggleModal(false)}}>Close</button>
                        </div>
                    </div>
                </ReactModal>
                {errorMessages}
            </div>

}

export default Branding;
