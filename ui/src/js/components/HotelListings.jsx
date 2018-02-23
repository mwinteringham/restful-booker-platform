import React from 'react';
import fetch from 'node-fetch';
import HotelListing from './HotelListing.jsx';

export default class HotelListings extends React.Component {

    constructor() {
        super();
		this.state = {
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
		
		this.updateHotels = this.updateHotels.bind(this);
		this.createHotel = this.createHotel.bind(this);
    }
    
    componentDidMount() {
		fetch('http://' + window.location.hostname + ':3001/hotel')
			.then(res => res.json())
			.then(body => {
				this.setState({hotels : body});
			});
	}

	updateHotels() {
		fetch('http://' + window.location.hostname + ':3001/hotel')
			.then(res => res.json())
			.then(body => {
				this.setState({hotels : body});
			});
	}

	createHotel() {
		this.state.newHotel.regdate = new Date();
		
		fetch('http://' + window.location.hostname + ':3001/hotel', {
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
				
				this.setState({newHotel : {}})
				this.updateHotels();
			}
		})
	}

    render() {
      let inputFields = null;
      if(this.props.isAuthenticated){
        inputFields = <div className="row">
						<div className="col-sm-2"><input type="text" id="hotelName" onChange={val => this.state.newHotel.name = val.target.value} /></div>
						<div className="col-sm-3"><input type="text" id="address" onChange={val => this.state.newHotel.address = val.target.value} /></div>
						<div className="col-sm-2"><input type="text" id="owner" onChange={val => this.state.newHotel.contact.name = val.target.value} /></div>
						<div className="col-sm-2"><input type="text" id="phone" onChange={val => this.state.newHotel.contact.phone = val.target.value} /></div>
						<div className="col-sm-2"><input type="text" id="email" onChange={val => this.state.newHotel.contact.email = val.target.value} /></div>
						<div className="col-sm-1"><input type="button" value="Create" id="createHotel" onClick={this.createHotel}/></div>
                      </div>
      }
      return(
        <div>
			<div className="row">
				<div className="col-sm-2 rowHeader"><p>Hotel name</p></div>
				<div className="col-sm-3 rowHeader"><p>Address</p></div>
				<div className="col-sm-2 rowHeader"><p>Owner</p></div>
				<div className="col-sm-2 rowHeader"><p>Phone number</p></div>
				<div className="col-sm-2 rowHeader"><p>Email</p></div>
				<div className="col-sm-1"></div>
			</div>
			{this.state.hotels.map((hotel, index) => {
				return <div key={hotel.hotelid}><HotelListing details={hotel} updateHotels={this.updateHotels} isAuthenticated={this.props.isAuthenticated}/></div>
			})}
			{inputFields}
        </div>
      );
    }
  }