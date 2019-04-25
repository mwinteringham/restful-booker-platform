import React from 'react';
import DatePicker from 'react-datepicker';
import moment from 'moment';
import { API } from '../libs/Api.js';

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
                    checkout: moment().add(1, 'day').format("YYYY-MM-DD")
                }
            },
            errors : []
        };

        this.handleStartChange = this.handleStartChange.bind(this);
        this.handleEndChange = this.handleEndChange.bind(this);
        this.createBooking = this.createBooking.bind(this);
        this.resetForm = this.resetForm.bind(this);
        this.updateState = this.updateState.bind(this);
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
    
    resetForm() {
        this.setState({
            newbooking: {
                roomid : this.props.roomid,
                firstname: "",
                lastname: "",
                totalprice: "",
                depositpaid: "false",
                bookingdates: {
                    checkin : moment().format("YYYY-MM-DD"),
                    checkout: moment().add(1, 'day').format("YYYY-MM-DD")
                }
            },
            errors : []
        })
    }

    updateState(event){
        let currentState = this.state;

        currentState.newbooking[event.target.id] = event.target.value;

        this.setState(currentState);
    }

    createBooking() {
        API.postBooking(this);
    }

    render(){
        let errors = '';

        if(Object.keys(this.state.errors).length > 0){
            errors = <div className="alert alert-danger" style={{marginTop: 15 + "px", marginBottom : 5 + "rem"}}>
                {this.state.errors.map((value) => {
                    return <p key={value}>{value}</p>
                })}
            </div>
        }

        return(
            <div>
                <div className="row" style={{marginTop : "10px"}}>
                    <div className="col-sm-2"><input type="text" className="form-control" id="firstname" value={this.state.newbooking.firstname} onChange={this.updateState} /></div>
                    <div className="col-sm-2"><input type="text" className="form-control" id="lastname" value={this.state.newbooking.lastname} onChange={this.updateState}/></div>
                    <div className="col-sm-1"><input type="text" className="form-control" id="totalprice" value={this.state.newbooking.totalprice} onChange={this.updateState} /></div>
                    <div className="col-sm-2">
                        <select id="depositpaid" className="form-control" value={this.state.newbooking.depositpaid} onChange={this.updateState} >
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
