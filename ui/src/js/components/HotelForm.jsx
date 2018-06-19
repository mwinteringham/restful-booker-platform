import React from 'react';
import validate from 'validate.js';
import { API_ROOT } from '../api-config';

const constraints = {
    name : {
        presence: true,
        length: {
            maximum: 18,
            minimum: 1
        },
        format: {
            pattern: "[ A-Za-z0-9]+",
            flags: "i",
            message: "can only contain A-Z, a-z and 0-9"
        }
    },
    address : {
        presence: true,
        length: {
            maximum: 30,
            minimum: 1
        },
        format: {
            pattern: "[ A-Za-z0-9]+",
            flags: "i",
            message: "can only contain A-Z, a-z and 0-9"
        }
    },
    "contact.name": {
        presence: true,
        length: {
            maximum: 18,
            minimum: 1
        }
    },
    "contact.phone": {
        presence: true,
        length: {
            is: 11
        }
    },
    "contact.email": {
        presence: true,
        email: true,
        length: {
            maximum: 30,
            minimum: 1
        }
    }
}

export default class HotelForm extends React.Component {

    constructor() {
        super();
		this.state = {
            errors : {},
            hotels : [], 
            newHotel : {
                "name": "",
                "address": "",
                "regdate": "",
                "contact": {
                    "name": "",
                    "phone": "",
                    "email": ""
                }
            }
        };

        this.createHotel = this.createHotel.bind(this);
    }

    createHotel() {
		this.state.newHotel.regdate = new Date();
        
        let vErrors = validate(this.state.newHotel, constraints);

        if(vErrors != null){
            this.setState({errors : vErrors})
        } else {
            fetch(API_ROOT.hotel + '/hotel', {
                method: 'POST',
                headers: {
                    'Accept': 'application/json',
                    'Content-Type': 'application/json'
                },
                credentials: 'include',
                body : JSON.stringify(this.state.newHotel)
            })
            .then(res => {
                if(res.status == 200){
                    document.getElementById("hotelName").value = '';
                    document.getElementById("address").value = '';
                    document.getElementById("owner").value = '';
                    document.getElementById("phone").value = '';
                    document.getElementById("email").value = '';
                    
                    this.setState({
                        errors : {},
                        newHotel : {
                            "name": "",
                            "address": "",
                            "regdate": "",
                            "contact": {
                                "name": "",
                                "phone": "",
                                "email": ""
                            }
                        }
                    })
                    this.props.updateHotels();
                }
            })
        }
    }
    
    render() {
        let errors = '';
        
        if(Object.keys(this.state.errors).length > 0){
            errors = <div className="alert alert-danger" style={{marginTop : 15 + "px"}}>
                    {Object.keys(this.state.errors).map((key, index) => {
                        return this.state.errors[key].map((value, index) => {
                            return <p key={index}>{value}</p>
                        })
                    })}
            </div>
        }

        return <div>
                    <div className="row">
                        <div className="col-sm-2"><input type="text" id="hotelName" onChange={val => this.state.newHotel.name = val.target.value} /></div>
                        <div className="col-sm-3"><input type="text" id="address" onChange={val => this.state.newHotel.address = val.target.value} /></div>
                        <div className="col-sm-2"><input type="text" id="owner" onChange={val => this.state.newHotel.contact.name = val.target.value} /></div>
                        <div className="col-sm-2"><input type="text" id="phone" onChange={val => this.state.newHotel.contact.phone = val.target.value} /></div>
                        <div className="col-sm-2"><input type="text" id="email" onChange={val => this.state.newHotel.contact.email = val.target.value} /></div>
                        <div className="col-sm-1"><input type="button" value="Create" id="createHotel" onClick={this.createHotel}/></div>
                    </div>
                    {errors}
                </div>
    }

}