import React from 'react';
import BookingListings from './BookingListings.jsx';
import Form from './BookingForm.jsx';
import { API_ROOT } from '../api-config';

export default class HotelDetails extends React.Component {

    constructor(){
        super()

        this.state = {
            edit : false,
            details : {
                name : "",
                address : "",
                regdate : "",
                contact : {},
                bookings : []
            },
            editHotel : {
                contact : {
                    name: "",
                    phone: "",
                    email: ""
                }
            }
        }

        this.enableEdit = this.enableEdit.bind(this);
        this.disableEdit = this.disableEdit.bind(this);
        this.doEdit = this.doEdit.bind(this);
        this.fetchHotelDetails = this.fetchHotelDetails.bind(this);
    }

    componentDidMount(){
        this.fetchHotelDetails();
    }

    enableEdit(){
        this.setState({edit : true});
    }

    disableEdit(){
        this.setState({edit : false});
    }

    doEdit(){
        fetch(API_ROOT.hotel + '/hotel/' + this.props.params.id, {
			method: 'PUT',
			headers: {
				'Accept': 'application/json',
				'Content-Type': 'application/json'
			},
            credentials: 'include',
            body : JSON.stringify(this.state.editHotel)
        })
        .then(res => res.json())
        .then(res => {
            this.setState({edit : false});
            this.fetchHotelDetails();
        })
        .catch(e => console.log(e));
    }

    fetchHotelDetails() {
        fetch(API_ROOT.hotel + '/hotel/' + this.props.params.id, {
            headers: {
				'Accept': 'application/json',
				'Content-Type': 'application/json'
			}
        })
        .then(res => res.json())
        .then(res => {
            this.setState({details : res})
            this.setState({editHotel : res})
        })
        .catch(e => console.log(e));
    }

    render(){
        let hotelSummary = null;
        let bookings = null;

        if(this.state.edit == true){
            hotelSummary =  <div className="row">
                                <div className="col-sm-6">
                                    <h2><input type="text" defaultValue={this.state.details.name} style={{width: "90%"}} onChange={val => this.state.editHotel.name = val.target.value} />
                                        <span className="glyphicon glyphicon-ok confirmHotelEdit" onClick={this.doEdit} style={{paddingLeft: 10 + "px", fontSize: 0.5 + "em"}}></span>
                                        <span className="glyphicon glyphicon-remove exitHotelEdit" onClick={this.disableEdit} style={{paddingLeft: 10 + "px", fontSize: 0.5 + "em"}}></span>
                                    </h2>
                                    <p>Address: <input type="text" defaultValue={this.state.details.address} onChange={val => this.state.editHotel.address = val.target.value} /></p>
                                    <p>Registration date: <span>{this.state.details.regdate.split('T')[0]}</span></p>
                                </div>
                                <div className="col-sm-6">
                                    <br />
                                    <br />
                                    <br />
                                    <p>Owner: <input type="text" defaultValue={this.state.details.contact.name} onChange={val => this.state.editHotel.contact.name = val.target.value} /></p>
                                    <p>Phone: <input type="text" defaultValue={this.state.details.contact.phone} onChange={val => this.state.editHotel.contact.phone = val.target.value} /></p>
                                    <p>Email: <input type="text" defaultValue={this.state.details.contact.email} onChange={val => this.state.editHotel.contact.email = val.target.value} /></p>
                                </div>
                            </div>
        } else {
            hotelSummary = <div className="row">
                                <div className="col-sm-6">
                                    <h2>{this.state.details.name} <span className="glyphicon glyphicon-pencil hotelEdit" onClick={this.enableEdit} style={{marginLeft: "5px", fontSize: 0.5 + "em"}} ></span></h2>
                                    <p>Address: <span>{this.state.details.address}</span></p>
                                    <p>Registration date: <span>{this.state.details.regdate.split('T')[0]}</span></p>
                                </div>
                                <div className="col-sm-6">
                                    <br />
                                    <br />
                                    <br />
                                    <p>Owner: <span>{this.state.details.contact.name}</span></p>
                                    <p>Phone: <span>{this.state.details.contact.phone}</span></p>
                                    <p>Email: <span>{this.state.details.contact.email}</span></p>
                                </div>
                            </div>
        }

        if(this.state.details.bookings){
            bookings = <BookingListings fetchHotelDetails={this.fetchHotelDetails} hotelid={this.props.params.id} bookings={this.state.details.bookings} />
        }

        return(
            <div>
                <div className="well">
                    <div className="container-fluid">
                        {hotelSummary}
                    </div>
                </div>
                <div className="row">
                    <div className="col-sm-2 rowHeader"><p>First name</p></div>
                    <div className="col-sm-2 rowHeader"><p>Last name</p></div>
                    <div className="col-sm-1 rowHeader"><p>Price</p></div>
                    <div className="col-sm-2 rowHeader"><p>Deposit paid?</p></div>
                    <div className="col-sm-2 rowHeader"><p>Check in</p></div>
                    <div className="col-sm-2 rowHeader"><p>Check out</p></div>
                    <div className="col-sm-1"></div>
                </div>
                {bookings}
                <Form fetchHotelDetails={this.fetchHotelDetails} hotelid={this.props.params.id}/>
            </div>
        )
    }

}