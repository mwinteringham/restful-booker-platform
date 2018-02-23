import React from 'react';

export default class BookingListing extends React.Component {

    constructor(){
        super();
    }

    render(){
        let buttons = null;

        if(this.props.isAuthenticated){
            buttons = <div className="col-sm-1">
                        <span className="glyphicon glyphicon-pencil bookingEdit"></span> 
                        <span className="glyphicon glyphicon-trash bookingDelete" id="{{bookingid}}"></span>
                      </div>
        } else {
            buttons = <div className="col-sm-1"></div>
        }

        return(
            <div className="row detail">
                <div className="col-sm-2"><p>{this.props.firstname}</p></div>
                <div className="col-sm-2"><p>{this.props.lastname}</p></div>
                <div className="col-sm-1"><p>{this.props.totalprice}</p></div>
                <div className="col-sm-2"><p>{String(this.props.depositpaid)}</p></div>
                <div className="col-sm-2"><p>{this.props.bookingdates.checkin.split('T')[0]}</p></div>
                <div className="col-sm-2"><p>{this.props.bookingdates.checkout.split('T')[0]}</p></div>
                {buttons}
            </div>
        )
    }

}