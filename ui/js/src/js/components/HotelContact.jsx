import React from 'react';

export default class HotelContact extends React.Component {

    render(){
        if(this.props.contact){
            return <div className='row contact'>
                        <div className='col-sm-1'></div>
                        <div className='col-sm-5'>
                            <form>
                                <div className="input-group mb-3">
                                    <div className="input-group-prepend">
                                        <span className="input-group-text" id="basic-addon1"><span className="fa fa-id-card"></span></span>
                                    </div>
                                    <input type="text" className="form-control" placeholder="Name" aria-label="Name" aria-describedby="basic-addon1" />
                                </div>
                                <div className="input-group mb-3">
                                    <div className="input-group-prepend">
                                        <span className="input-group-text" id="basic-addon1"><span className="fa fa-envelope"></span></span>
                                    </div>
                                    <input type="text" className="form-control" placeholder="Email" aria-label="Email" aria-describedby="basic-addon1" />
                                </div>
                                <div className="input-group mb-3">
                                    <div className="input-group-prepend">
                                        <span className="input-group-text" id="basic-addon1"><span className="fa fa-phone"></span></span>
                                    </div>
                                    <input type="text" className="form-control" placeholder="Phone" aria-label="Phone" aria-describedby="basic-addon1" />
                                </div>
                                <div className="input-group mb-3">
                                    <div className="input-group-prepend">
                                        <span className="input-group-text" id="basic-addon1"><span className="fa fa-envelope"></span></span>
                                    </div>
                                    <input type="text" className="form-control" placeholder="Subject" aria-label="Subject" aria-describedby="basic-addon1" />
                                </div>
                                <div className="input-group">
                                    <div className="input-group-prepend">
                                        <span className="input-group-text">Message</span>
                                    </div>
                                    <textarea className="form-control" aria-label="Message" rows="5"></textarea>
                                </div>
                                <br />
                                <button type='button' className='btn btn-outline-secondary float-right'>Submit</button>
                            </form>
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