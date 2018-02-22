import React from 'react';
import PropTypes from 'prop-types'
import { withRouter } from 'react-router-dom';

export default class Hotel extends React.Component {

    constructor() {
        super();

        this.navigateToHotel = this.navigateToHotel.bind(this);
        this.deleteBooking = this.deleteBooking.bind(this);
    }

    navigateToHotel(){        
        // const { history } = this.props;
        // history.push('/hotel/' + this.props.details.hotelid);
    }

    deleteBooking(){
        fetch('http://localhost:3001/hotel/' + this.props.details.hotelid, {
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
            <div className="row" onClick={() => this.navigateToHotel()}>
                <div className="col-sm-2"><p>{this.props.details.name}</p></div>
                <div className="col-sm-3"><p>{this.props.details.address}</p></div>
                <div className="col-sm-2"><p>{this.props.details.contact.name}</p></div>
                <div className="col-sm-2"><p>{this.props.details.contact.phone}</p></div>
                <div className="col-sm-2"><p>{this.props.details.contact.email}</p></div>
                <div className="col-sm-1">{deleteHotel}</div>
            </div>
        );
    }
}

// Hotel.propTypes = {
//     match: PropTypes.object.isRequired,
//     location: PropTypes.object.isRequired,
//     history: PropTypes.object.isRequired
// }

// export default withRouter(Hotel);