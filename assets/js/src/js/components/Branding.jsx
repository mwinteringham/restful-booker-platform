import React from 'react';
import { API } from '../libs/Api.js';
import ReactModal from 'react-modal';

export default class Branding extends React.Component {
    
    constructor(){
        super();

        this.state = {
            branding : {
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
            },
            showModal : false,
            errors : []
        }

        this.updateState = this.updateState.bind(this);
        this.doUpdate = this.doUpdate.bind(this);
        this.handleCloseModal = this.handleCloseModal.bind(this);
    }

    componentDidMount(){
        API.getBranding(this);
    }

    doUpdate(){
        API.putBranding(this);
    }

    updateState(event){
        let currentState = this.state;
        
        switch(event.target.id){
            case 'latitude':
                currentState.branding.map.latitude = event.target.value;
                break;
            case 'longitude':
                currentState.branding.map.longitude = event.target.value;
                break;
            case 'contactName':
                currentState.branding.contact.name = event.target.value;
                break;
            case 'contactAddress':
                currentState.branding.contact.address = event.target.value;
                break;
            case 'contactPhone':
                currentState.branding.contact.phone = event.target.value;
                break;
            case 'contactEmail':
                currentState.branding.contact.email = event.target.value;
                break;
            default :
                currentState.branding[event.target.id] = event.target.value;
                break;
        }

        this.setState(currentState);
    }

    handleCloseModal () {
        this.setState({ showModal: false });
    }

    render(){
        let errors = '';
        
        if(this.state.errors.length > 0){
            errors = <div className="alert alert-danger" style={{marginTop : 1 + "rem"}}>
                {this.state.errors.map((value) => {
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
                        <input type="text" className="form-control" id="name" value={this.state.branding.name} onChange={this.updateState} placeholder="Enter B&amp;B name" />
                    </div>
                    <div className="input-group mb-3">
                        <div className="input-group-prepend">
                            <span className="input-group-text">Logo</span>
                        </div>
                        <input type="text" className="form-control" id="logoUrl" value={this.state.branding.logoUrl} onChange={this.updateState} placeholder="Enter image url" />
                    </div>
                    <div className="input-group">
                        <div className="input-group-prepend">
                            <span className="input-group-text">Description</span>
                        </div>
                        <textarea className="form-control" value={this.state.branding.description} onChange={this.updateState} id="description" rows="5"></textarea>
                    </div>
                    <br />
                    <h2>Map details</h2>
                    <div className="input-group mb-3">
                        <div className="input-group-prepend">
                            <span className="input-group-text">Latitude</span>
                        </div>
                        <input type="text" className="form-control" id="latitude" value={this.state.branding.map.latitude} onChange={this.updateState} placeholder="Enter Latitude" />
                    </div>
                    <div className="input-group mb-3">
                        <div className="input-group-prepend">
                            <span className="input-group-text">Longitude</span>
                        </div>
                        <input type="text" className="form-control" id="longitude" value={this.state.branding.map.longitude} onChange={this.updateState} placeholder="Enter Longitude" />
                    </div>
                    <br />
                    <h2>Contact details</h2>
                    <div className="input-group mb-3">
                        <div className="input-group-prepend">
                            <span className="input-group-text">Name</span>
                        </div>
                        <input type="text" className="form-control" id="contactName" value={this.state.branding.contact.name} onChange={this.updateState} placeholder="Enter Contact Name" />
                    </div>
                    <div className="input-group mb-3">
                        <div className="input-group-prepend">
                            <span className="input-group-text">Address</span>
                        </div>
                        <input type="text" className="form-control" id="contactAddress" value={this.state.branding.contact.address} onChange={this.updateState} placeholder="Enter Address" />
                    </div>
                    <div className="input-group mb-3">
                        <div className="input-group-prepend">
                            <span className="input-group-text">Phone</span>
                        </div>
                        <input type="text" className="form-control" id="contactPhone" value={this.state.branding.contact.phone} onChange={this.updateState} placeholder="Enter Phone Number" />
                    </div>
                    <div className="input-group mb-3">
                        <div className="input-group-prepend">
                            <span className="input-group-text">Email</span>
                        </div>
                        <input type="email" className="form-control" id="contactEmail" value={this.state.branding.contact.email} onChange={this.updateState} placeholder="Enter Email Address" />
                    </div>
                    <button type="submit" id="updateBranding" className="btn btn-outline-primary" onClick={this.doUpdate}>Submit</button>
                    <ReactModal 
                        isOpen={this.state.showModal}
                        contentLabel="onRequestClose Example"
                        onRequestClose={this.handleCloseModal}
                        className="Modal"
                        >
                        
                        <div className="form-row text-center">
                            <div className="col-12">
                                <p>Branding updated!</p>
                                <button className="btn btn-outline-primary" onClick={this.handleCloseModal}>Close</button>
                            </div>
                        </div>
                    </ReactModal>
                    {errors}
                </div>
    }

}