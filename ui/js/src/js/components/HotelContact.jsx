import React from 'react';
import { API } from '../libs/Api';

export default class HotelContact extends React.Component {

    constructor() {
        super();

        this.state = {
            contact : {
                name : "",
                email : "",
                phone : "",
                subject : "",
                description : "",
            },
            submitted : false,
            errors : []
        }

        this.updateState = this.updateState.bind(this);
        this.submitForm = this.submitForm.bind(this);
    }

    updateState(event){
        let currentState = this.state.contact;

        currentState[event.target.id] = event.target.value;

        this.setState({contact : currentState});
    }

    submitForm(){
        API.postMessage(this);
    }

    render(){
        let form = '';
        let errors = '';

        if(this.state.errors.length > 0){
            errors = <div className="alert alert-danger" style={{marginBottom : 5 + "rem"}}>
                {this.state.errors.map((value) => {
                    return <p key={value}>{value}</p>
                })}
            </div>
        }

        if(this.state.submitted){
            form = <div style={{height : "412px"}}>
                    <h2>Thanks for getting in touch {this.state.contact.name}!</h2>
                    <p>We'll get back to you about</p>
                    <p style={{fontWeight : "bold"}}>{this.state.contact.subject}</p>
                    <p>as soon as possible.</p>
                    </div>
        } else {
            form = <form>
                    <div className="input-group mb-3">
                        <div className="input-group-prepend">
                            <span className="input-group-text" id="basic-addon1"><span className="fa fa-id-card"></span></span>
                        </div>
                        <input type="text" className="form-control" placeholder="Name" aria-label="Name" id="name" aria-describedby="basic-addon1" onChange={this.updateState} />
                    </div>
                    <div className="input-group mb-3">
                        <div className="input-group-prepend">
                            <span className="input-group-text" id="basic-addon1"><span className="fa fa-envelope"></span></span>
                        </div>
                        <input type="text" className="form-control" placeholder="Email" aria-label="Email" id="email" aria-describedby="basic-addon1" onChange={this.updateState} />
                    </div>
                    <div className="input-group mb-3">
                        <div className="input-group-prepend">
                            <span className="input-group-text" id="basic-addon1"><span className="fa fa-phone"></span></span>
                        </div>
                        <input type="text" className="form-control" placeholder="Phone" aria-label="Phone" id="phone" aria-describedby="basic-addon1" onChange={this.updateState} />
                    </div>
                    <div className="input-group mb-3">
                        <div className="input-group-prepend">
                            <span className="input-group-text" id="basic-addon1"><span className="fa fa-envelope"></span></span>
                        </div>
                        <input type="text" className="form-control" placeholder="Subject" aria-label="Subject" id="subject" aria-describedby="basic-addon1" onChange={this.updateState} />
                    </div>
                    <div className="input-group">
                        <div className="input-group-prepend">
                            <span className="input-group-text">Message</span>
                        </div>
                        <textarea className="form-control" aria-label="Description" id="description" rows="5" onChange={this.updateState}></textarea>
                    </div>
                    <br />
                    {errors}
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