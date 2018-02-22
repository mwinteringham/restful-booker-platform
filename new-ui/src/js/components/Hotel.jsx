import React from 'react';
import PropTypes from 'prop-types'
import { withRouter } from 'react-router-dom';

class Hotel extends React.Component {

    constructor() {
        super();

        this.handleOnClick = this.handleOnClick.bind(this);
    }

    handleOnClick(){        
        const { history } = this.props;
        history.push('/hotel/' + this.props.details.hotelid);
    }

    render() {
        let deleteHotel = null;
        if(this.props.isAuthenticated){
            deleteHotel = <span class="glyphicon glyphicon-remove hotelDelete" id={this.props.details.hotelid}></span>
        }

        return(
            <div className="row" onClick={() => this.handleOnClick()}>
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

Hotel.propTypes = {
    match: PropTypes.object.isRequired,
    location: PropTypes.object.isRequired,
    history: PropTypes.object.isRequired
}

export default withRouter(Hotel);