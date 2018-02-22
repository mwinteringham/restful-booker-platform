import React from 'react';
import fetch from 'node-fetch';
import Hotel from './Hotel.jsx';

export default class Hotels extends React.Component {

    constructor() {
        super();
        this.state = { hotels : []};
    }
    
    componentDidMount() {
      fetch('http://localhost:3001/hotel')
        .then(res => res.json())
        .then(body => {
          this.setState({hotels : body});
        });
    }

    render() {
      let inputFields = null;
      if(this.props.isAuthenticated){
        inputFields = <div className="row">
						<div className="col-sm-2"><input type="text" id="hotelName" /></div>
						<div className="col-sm-3"><input type="text" id="address" /></div>
						<div className="col-sm-2"><input type="text" id="owner" /></div>
						<div className="col-sm-2"><input type="text" id="phone" /></div>
						<div className="col-sm-2"><input type="text" id="email" /></div>
						<div className="col-sm-1"><input type="button" value="Create" id="createHotel"/></div>
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
            return <div key={hotel.hotelid}><Hotel details={hotel} isAuthenticated={this.props.isAuthenticated}/></div>
		  })}
		  {inputFields}
        </div>
      );
    }
  }