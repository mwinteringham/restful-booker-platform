import React, { useState } from 'react';
import fetch from 'node-fetch';
import { API_ROOT } from '../api-config';

export default class Branding extends React.Component {
    
    constructor(){
        super();

        this.state = {
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
        }

        this.updateState = this.updateState.bind(this);
        this.doUpdate = this.doUpdate.bind(this);
    }

    componentDidMount(){
        fetch(API_ROOT.branding + '/branding/', {
			method: 'GET',
			headers: {
				'Accept': 'application/json',
				'Content-Type': 'application/json'
			}
        })
        .then(res => res.json())
        .then(res => {
            this.setState(res);
        });
    }

    doUpdate(){
        fetch(API_ROOT.branding + '/branding/', {
            method: 'PUT',
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json'
            },
            credentials: 'include',
            body : JSON.stringify(this.state)
        })
        .catch(e => console.log(e));
    }

    updateState(event){
        let currentState = this.state;
        
        switch(event.target.id){
            case 'latitude':
                currentState.map.latitude = event.target.value;
                break;
            case 'longitude':
                currentState.map.longitude = event.target.value;
                break;
            case 'contactName':
                currentState.contact.name = event.target.value;
                break;
            case 'contactAddress':
                currentState.contact.address = event.target.value;
                break;
            case 'contactPhone':
                currentState.contact.phone = event.target.value;
                break;
            case 'contactEmail':
                currentState.contact.email = event.target.value;
                break;
            default :
                currentState[event.target.id] = event.target.value;
                break;
        }

        this.setState(currentState);
    }

    render(){
        return <div className="branding-form">
                    <h2>B&amp;B details</h2>
                    <div className="input-group mb-3">
                        <div className="input-group-prepend">
                            <span className="input-group-text">Name</span>
                        </div>
                        <input type="text" className="form-control" id="name" value={this.state.name} onChange={this.updateState} placeholder="Enter B&amp;B name" />
                    </div>
                    <div className="input-group mb-3">
                        <div className="input-group-prepend">
                            <span className="input-group-text">Logo</span>
                        </div>
                        <input type="text" className="form-control" id="logoUrl" value={this.state.logoUrl} onChange={this.updateState} placeholder="Enter image url" />
                    </div>
                    <div className="input-group">
                        <div className="input-group-prepend">
                            <span className="input-group-text">Description</span>
                        </div>
                        <textarea className="form-control" value={this.state.description} onChange={this.updateState} id="description" rows="5"></textarea>
                    </div>
                    <br />
                    <h2>Map details</h2>
                    <div className="input-group mb-3">
                        <div className="input-group-prepend">
                            <span className="input-group-text">Latitude</span>
                        </div>
                        <input type="text" className="form-control" id="latitude" value={this.state.map.latitude} onChange={this.updateState} placeholder="Enter Latitude" />
                    </div>
                    <div className="input-group mb-3">
                        <div className="input-group-prepend">
                            <span className="input-group-text">Longitude</span>
                        </div>
                        <input type="text" className="form-control" id="longitude" value={this.state.map.longitude} onChange={this.updateState} placeholder="Enter Longitude" />
                    </div>
                    <br />
                    <h2>Contact details</h2>
                    <div className="input-group mb-3">
                        <div className="input-group-prepend">
                            <span className="input-group-text">Name</span>
                        </div>
                        <input type="text" className="form-control" id="contactName" value={this.state.contact.name} onChange={this.updateState} placeholder="Enter Contact Name" />
                    </div>
                    <div className="input-group mb-3">
                        <div className="input-group-prepend">
                            <span className="input-group-text">Address</span>
                        </div>
                        <input type="text" className="form-control" id="contactAddress" value={this.state.contact.address} onChange={this.updateState} placeholder="Enter Address" />
                    </div>
                    <div className="input-group mb-3">
                        <div className="input-group-prepend">
                            <span className="input-group-text">Phone</span>
                        </div>
                        <input type="text" className="form-control" id="contactPhone" value={this.state.contact.phone} onChange={this.updateState} placeholder="Enter Phone Number" />
                    </div>
                    <div className="input-group mb-3">
                        <div className="input-group-prepend">
                            <span className="input-group-text">Email</span>
                        </div>
                        <input type="email" className="form-control" id="contactEmail" value={this.state.contact.email} onChange={this.updateState} placeholder="Enter Email Address" />
                    </div>
                    <button type="submit" className="btn btn-outline-primary" onClick={this.doUpdate}>Submit</button>
                </div>
    }

}