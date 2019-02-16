import React, { useState } from 'react';
import fetch from 'node-fetch';
import { API_ROOT } from '../api-config';

export default class App extends React.Component {
    
    constructor(){
        super();

        this.state = {
            map: {
                latitude: 0,
                longitude: 0
            },
            logo: {
                url: ''
            },
            description: '',
            contact: {
                name: '',
                address: '',
                phone: '',
                email: ''
            }
        }
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
        })
        .catch(e => console.log(e));
    }

    render(){
        return <div class="branding-form">
                    <h2>B&amp;B details</h2>
                    <div class="input-group mb-3">
                        <div className="input-group-prepend">
                            <span className="input-group-text">Name</span>
                        </div>
                        <input type="text" class="form-control" id="bbName" value={this.state.name} placeholder="Enter B&amp;B name" />
                    </div>
                    <div class="input-group mb-3">
                        <div className="input-group-prepend">
                            <span className="input-group-text">Logo</span>
                        </div>
                        <input type="text" class="form-control" id="logoUrl" value={this.state.logo.url} placeholder="Enter image url" />
                    </div>
                    <div className="input-group">
                        <div className="input-group-prepend">
                            <span className="input-group-text">Description</span>
                        </div>
                        <textarea className="form-control" aria-label="Message" value={this.state.description} id="description" rows="5"></textarea>
                    </div>
                    <br />
                    <h2>Map details</h2>
                    <div class="input-group mb-3">
                        <div className="input-group-prepend">
                            <span className="input-group-text">Latitude</span>
                        </div>
                        <input type="text" class="form-control" id="latitude" value={this.state.map.latitude} placeholder="Enter Latitude" />
                    </div>
                    <div class="input-group mb-3">
                        <div className="input-group-prepend">
                            <span className="input-group-text">Longitude</span>
                        </div>
                        <input type="text" class="form-control" id="longitude" value={this.state.map.longitude} placeholder="Enter Longitude" />
                    </div>
                    <br />
                    <h2>Contact details</h2>
                    <div class="input-group mb-3">
                        <div className="input-group-prepend">
                            <span className="input-group-text">Name</span>
                        </div>
                        <input type="text" class="form-control" id="name" value={this.state.contact.name} placeholder="Enter Contact Name" />
                    </div>
                    <div class="input-group mb-3">
                        <div className="input-group-prepend">
                            <span className="input-group-text">Address</span>
                        </div>
                        <input type="text" class="form-control" id="address" value={this.state.contact.address} placeholder="Enter Address" />
                    </div>
                    <div class="input-group mb-3">
                        <div className="input-group-prepend">
                            <span className="input-group-text">Phone</span>
                        </div>
                        <input type="text" class="form-control" id="phone" value={this.state.contact.phone} placeholder="Enter Phone Number" />
                    </div>
                    <div class="input-group mb-3">
                        <div className="input-group-prepend">
                            <span className="input-group-text">Email</span>
                        </div>
                        <input type="email" class="form-control" id="email" value={this.state.contact.email} placeholder="Enter Email Address" />
                    </div>
                    <button type="submit" class="btn btn-primary">Submit</button>
                </div>
    }

}