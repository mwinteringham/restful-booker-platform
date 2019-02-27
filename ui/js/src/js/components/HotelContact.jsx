import React from 'react';
import validate from 'validate.js';

let rules = {
    "name": {
        presence : true,
        length: {
            minimum: 3,
            message: "must be at least 3 characters long"
        }
    },
    "email": {
        presence : true,
        email : true
    },
    "phone": {
        presence : true,
        numericality: {
            onlyInteger: true
        },
        length: {
            minimum: 11,
            message: "must be at least 11 digits long"
        }
    },
    "subject": {
        presence : true,
        length: {
            minimum: 20,
            message: "must be at least 20 characters long"
        }
    },
    "message" : {
        presence : true,
        length: {
            minimum: 20,
            message: "must be at least 20 characters long"
        }
    }
}

export default class HotelContact extends React.Component {

    constructor() {
        super();

        this.state = {
            name : "",
            email : "",
            phone : "",
            subject : "",
            message : "",
            submitted : false,
            errors : {
                name : [],
                email : [],
                phone : [],
                subject : [],
                message : [],
            }
        }

        this.updateState = this.updateState.bind(this);
        this.submitForm = this.submitForm.bind(this);
    }

    updateState(event){
        let currentState = this.state;

        currentState[event.target.id] = event.target.value;

        this.setState(currentState);
    }

    submitForm(){
        let vErrors = validate(this.state, rules);

        if(typeof vErrors === 'undefined'){
            this.setState({ submitted : true});
        } else {
            for (let prop in vErrors) {
                let currentState = this.state;
                currentState.errors[prop] = vErrors[prop];
                this.setState(currentState)
            }
        }
    }

    render(){
        let form = "";

        if(this.state.submitted){
            form = <div style={{height : "412px"}}>
                    <h2>Thanks for getting in touch {this.state.name}!</h2>
                    <p>We'll get back to you about</p>
                    <p style={{fontWeight : "bold"}}>{this.state.subject}</p>
                    <p>as soon as possible.</p>
                    </div>
        } else {
            form = <form>
                    <div className="input-group mb-3">
                        <div className="input-group-prepend">
                            <span className="input-group-text" id="basic-addon1"><span className="fa fa-id-card"></span></span>
                        </div>
                        <input type="text" className="form-control" placeholder="Name" aria-label="Name" id="name" aria-describedby="basic-addon1" onChange={this.updateState} />
                        {this.state.errors.name.map((value, index) => {
                            return <div key={"name" + index} className="invalid-feedback">{value}</div>
                        })}
                    </div>
                    <div className="input-group mb-3">
                        <div className="input-group-prepend">
                            <span className="input-group-text" id="basic-addon1"><span className="fa fa-envelope"></span></span>
                        </div>
                        <input type="text" className="form-control" placeholder="Email" aria-label="Email" id="email" aria-describedby="basic-addon1" onChange={this.updateState} />
                        {this.state.errors.email.map((value, index) => {
                            return <div key={"email" + index} className="invalid-feedback">{value}</div>
                        })}
                    </div>
                    <div className="input-group mb-3">
                        <div className="input-group-prepend">
                            <span className="input-group-text" id="basic-addon1"><span className="fa fa-phone"></span></span>
                        </div>
                        <input type="text" className="form-control" placeholder="Phone" aria-label="Phone" id="phone" aria-describedby="basic-addon1" onChange={this.updateState} />
                        {this.state.errors.phone.map((value, index) => {
                            return <div key={"phone" + index} className="invalid-feedback">{value}</div>
                        })}
                    </div>
                    <div className="input-group mb-3">
                        <div className="input-group-prepend">
                            <span className="input-group-text" id="basic-addon1"><span className="fa fa-envelope"></span></span>
                        </div>
                        <input type="text" className="form-control" placeholder="Subject" aria-label="Subject" id="subject" aria-describedby="basic-addon1" onChange={this.updateState} />
                        {this.state.errors.subject.map((value, index) => {
                            return <div key={"subject" + index} className="invalid-feedback">{value}</div>
                        })}
                    </div>
                    <div className="input-group">
                        <div className="input-group-prepend">
                            <span className="input-group-text">Message</span>
                        </div>
                        <textarea className="form-control" aria-label="Message" id="message" rows="5" onChange={this.updateState}></textarea>
                        {this.state.errors.message.map((value, index) => {
                            return <div key={"message" + index} className="invalid-feedback">{value}</div>
                        })}
                    </div>
                    <br />
                    <button type='button' className='btn btn-outline-primary float-right' id="submitContact" onClick={this.submitForm}>Submit</button>
                </form>
        }

        if(this.props.contact){
            return <div className='row contact'>
                        <div className='col-sm-1'></div>
                        <div className='col-sm-5'>
                            {form}
                        </div>
                        <div className='col-sm-5'>
                            <p><span className="fa fa-home"></span> {this.props.contact.name}</p>
                            <p><span></span> {this.props.contact.address}</p>
                            <p><span className="fa fa-phone"></span> {this.props.contact.phone}</p>
                            <p><span className="fa fa-envelope"></span> {this.props.contact.email}</p>
                        </div>
                        <div className='col-sm-1'></div>
                    </div>
        } else {
            return <p>ERROR: Missing contact details to render</p>
        }
    }

}