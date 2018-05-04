import React from 'react';
import fetch from 'node-fetch';
import HotelListing from './HotelListing.jsx';
import HotelForm from './HotelForm.jsx';

export default class HotelListings extends React.Component {

    constructor() {
        super();
		this.state = {
			hotels : []
		};
		
		this.updateHotels = this.updateHotels.bind(this);
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

    render() {	  
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
					return <div key={hotel.hotelid}><HotelListing details={hotel} updateHotels={this.updateHotels} /></div>
				})}
				<HotelForm updateHotels={this.updateHotels}/>
			</div>
		);
    }
  }