import React from 'react';
import { Link } from 'react-router-dom';

export default class Hotel extends React.Component {

    constructor() {
        super();
    }

    render() {
      return(
        <Link to={"/hotel/" + this.props.details.hotelid}>
            <div className="row">
                <div className="col-sm-2"><p>{this.props.details.name}</p></div>
                <div className="col-sm-3"><p>{this.props.details.address}</p></div>
                <div className="col-sm-2"><p>{this.props.details.contact.name}</p></div>
                <div className="col-sm-2"><p>{this.props.details.contact.phone}</p></div>
                <div className="col-sm-2"><p>{this.props.details.contact.email}</p></div>
                <div className="col-sm-1"></div>
            </div>
        </Link>
      );
    }
  }