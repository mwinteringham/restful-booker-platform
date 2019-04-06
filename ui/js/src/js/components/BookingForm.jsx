import React from 'react';
import DatePicker from 'react-datepicker';
import moment from 'moment';
import validate from 'validate.js';
import { API_ROOT } from '../api-config';
import { constraints } from '../libs/ValidateRules.js'

import 'react-datepicker/dist/react-datepicker.css';

export default class BookingForm extends React.Component {

    constructor(){
        super()

        this.state = {
            newbooking : {
                roomid: null,
                firstname: "",
                lastname: "",
                totalprice: "",
                depositpaid: "false",
                bookingdates: {
                    checkin: moment().format("YYYY-MM-DD"),
                    checkout: moment().format("YYYY-MM-DD")
                }
            },
            errors : {}
        };

        this.handleStartChange = this.handleStartChange.bind(this);
        this.handleEndChange = this.handleEndChange.bind(this);
        this.createBooking = this.createBooking.bind(this);
    }

    componentDidMount(){
        let currentState = this.state;
        currentState.newbooking.roomid = this.props.roomid;

        this.setState({newbooking : currentState.newbooking});
    }

    handleStartChange(date) {
        if(date != null){
            let currentState = this.state;
            currentState.newbooking.bookingdates.checkin = moment(date.toUTCString()).format("YYYY-MM-DD");

            this.setState({newbooking : currentState.newbooking});
        }
    }

    handleEndChange(date) {
        if(date != null){
            let currentState = this.state;
            currentState.newbooking.bookingdates.checkout = moment(date.toUTCString()).format("YYYY-MM-DD");

            this.setState({newbooking : currentState.newbooking});
        }
    }

    createBooking() {
        let vErrors = validate(this.state.newbooking, constraints.booking);

        if(vErrors != null){
            this.setState({errors : vErrors})
        } else {
            fetch(API_ROOT + '/booking/', {
                method: 'POST',
                headers: {
                    'Accept': 'application/json',
                    'Content-Type': 'application/json'
                },
                credentials: 'include',
                body : JSON.stringify(this.state.newbooking)
            })
            .then(res => {
                if(res.status == 200){
                    this.props.fetchRoomDetails();

                    document.getElementById("firstname").value = '';
                    document.getElementById("lastname").value = '';
                    document.getElementById("totalprice").value = '';
                    document.getElementById("depositpaid").value = 'false';

                    this.setState({
                        newbooking: {
                            roomid : this.props.roomid,
                            firstname: "",
                            lastname: "",
                            totalprice: "",
                            depositpaid: "false",
                            bookingdates: {
                                checkin : moment().format("YYYY-MM-DD"),
                                checkout : moment().format("YYYY-MM-DD")
                            }
                        },
                        errors : {}
                    })
                } else if (res.status == 409){
                    this.setState({errors : {
                        dateconflict : ["The room is already booked for one or more of the dates that you have selected."]
                    }});
                }
            })
            .catch(e => console.log(e))
        }
    }

    render(){
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

        return(
            <div>
                <div className="row" style={{marginTop : "10px"}}>
                    <div className="col-sm-2"><input type="text" className="form-control" id="firstname" onChange={val => this.state.newbooking.firstname = val.target.value} /></div>
                    <div className="col-sm-2"><input type="text" className="form-control" id="lastname" onChange={val => this.state.newbooking.lastname = val.target.value}/></div>
                    <div className="col-sm-1"><input type="text" className="form-control" id="totalprice" onChange={val => this.state.newbooking.totalprice = val.target.value} /></div>
                    <div className="col-sm-2">
                        <select id="depositpaid" className="form-control" onChange={val => this.state.newbooking.depositpaid = val.target.value} >
                            <option value="false">false</option>
                            <option value="true">true</option>
                        </select>
                    </div>
                    <div className="col-sm-2 checkin"><DatePicker className="form-control" selected={moment(this.state.newbooking.bookingdates.checkin).utc(true).toDate()} onChange={this.handleStartChange} dateFormat="YYYY-MM-dd" /></div>
                    <div className="col-sm-2 checkout"><DatePicker className="form-control" selected={moment(this.state.newbooking.bookingdates.checkout).utc(true).toDate()}  onChange={this.handleEndChange} dateFormat="YYYY-MM-dd" /></div>
                    <div className="col-sm-1">
                        <button className="btn btn-outline-primary" id="createBooking" type="submit" onClick={this.createBooking}>Create</button>
                    </div>
                </div>
                {errors}
            </div>
        )
    }
}
