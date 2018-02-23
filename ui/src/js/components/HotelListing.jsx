import React from 'react';
import PropTypes from 'prop-types'
import { Link } from 'react-router-dom';

export default class HotelListing extends React.Component {

    constructor() {
        super();

        this.deleteBooking = this.deleteBooking.bind(this);
    }

    deleteBooking(){
        fetch('http://' + window.location.hostname + ':3001/hotel/' + this.props.details.hotelid, {
            method: 'DELETE',
            credentials: 'include'
        })
        .then(res => {
            if(res.status == 201){
                this.props.updateHotels();
            }
        })
    }

    render() {
        let deleteHotel = null;
        if(this.props.isAuthenticated){
            deleteHotel = <span className="glyphicon glyphicon-remove hotelDelete" id={this.props.details.hotelid} onClick={() => this.deleteBooking()}></span>
        }

        return(
            <div className="row detail">
                <Link to={"/hotel/" + this.props.details.hotelid}>
                    <div className="col-sm-2"><p>{this.props.details.name}</p></div>
                    <div className="col-sm-3"><p>{this.props.details.address}</p></div>
                    <div className="col-sm-2"><p>{this.props.details.contact.name}</p></div>
                    <div className="col-sm-2"><p>{this.props.details.contact.phone}</p></div>
                    <div className="col-sm-2"><p>{this.props.details.contact.email}</p></div>
                </Link>
                <div className="col-sm-1">{deleteHotel}</div>
            </div>
        );
    }
}