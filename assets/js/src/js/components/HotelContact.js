import React from 'react';
import { useState } from 'react';
import { API } from '../libs/Api';

const HotelContact = ({contactDetails}) => {

    const [contact, setContactDetails] = useState({
        name : "",
        email : "",
        phone : "",
        subject : "", 
        description : ""
    });
    const [submitted, setSubmitted] = useState(false);
    const [errorMessages, setErrors] = useState([]);

    const updateContact = (event) => {
        contact[event.id] = event.value;

        setContactDetails(prevContact => ({
            ...prevContact
        }));
    }

    const submitForm = () => {
        API.postMessage(contact, setSubmitted, setErrors);
    }

    let form = '';
    let errors = '';

    if(errorMessages.length > 0){
        errors = <div className="alert alert-danger" style={{marginBottom : 5 + "rem"}}>
            {errorMessages.map((value, id) => {
                return <p key={id}>{value}</p>
            })}
        </div>
    }

    if(submitted){
        form = <div style={{height : "412px"}}>
                <h2>Thanks for getting in touch {contact.name}!</h2>
                <p>We'll get back to you about</p>
                <p style={{fontWeight : "bold"}}>{contact.subject}</p>
                <p>as soon as possible.</p>
                </div>
    } else {
        form = <form>
                <div className="input-group mb-3">
                    <div className="input-group-prepend">
                        <span className="input-group-text" id="basic-addon1"><span className="fa fa-id-card"></span></span>
                    </div>
                    <input type="text" data-testid="ContactName" className="form-control" placeholder="Name" aria-label="Name" id="name" aria-describedby="basic-addon1" onChange={e => updateContact(e.target)} />
                </div>
                <div className="input-group mb-3">
                    <div className="input-group-prepend">
                        <span className="input-group-text" id="basic-addon1"><span className="fa fa-envelope"></span></span>
                    </div>
                    <input type="text" data-testid="ContactEmail" className="form-control" placeholder="Email" aria-label="Email" id="email" aria-describedby="basic-addon1" onChange={e => updateContact(e.target)} />
                </div>
                <div className="input-group mb-3">
                    <div className="input-group-prepend">
                        <span className="input-group-text" id="basic-addon1"><span className="fa fa-phone"></span></span>
                    </div>
                    <input type="text" data-testid="ContactPhone" className="form-control" placeholder="Phone" aria-label="Phone" id="phone" aria-describedby="basic-addon1" onChange={e => updateContact(e.target)} />
                </div>
                <div className="input-group mb-3">
                    <div className="input-group-prepend">
                        <span className="input-group-text" id="basic-addon1"><span className="fa fa-envelope"></span></span>
                    </div>
                    <input type="text" data-testid="ContactSubject" className="form-control" placeholder="Subject" aria-label="Subject" id="subject" aria-describedby="basic-addon1" onChange={e => updateContact(e.target)} />
                </div>
                <div className="input-group">
                    <div className="input-group-prepend">
                        <span className="input-group-text">Message</span>
                    </div>
                    <textarea data-testid="ContactDescription" className="form-control" aria-label="Description" id="description" rows="5" onChange={e => updateContact(e.target)}></textarea>
                </div>
                <br />
                {errors}
                <button type='button' className='btn btn-outline-primary float-right' id="submitContact" onClick={submitForm}>Submit</button>
            </form>
    }

    if(contactDetails){
        return (<div className='row contact'>
                    <div className='col-sm-1'></div>
                    <div className='col-sm-5'>
                        {form}
                    </div>
                    <div className='col-sm-5'>
                        <p><span className="fa fa-home"></span> {contactDetails.name}</p>
                        <p><span></span> {contactDetails.address}</p>
                        <p><span className="fa fa-phone"></span> {contactDetails.phone}</p>
                        <p><span className="fa fa-envelope"></span> {contactDetails.email}</p>
                    </div>
                    <div className='col-sm-1'></div>
                </div>)
    } else {
        return (<p>ERROR: Missing contact details to render</p>);
    }

}

export default HotelContact;