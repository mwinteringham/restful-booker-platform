import React from 'react';
import ReactModal from 'react-modal';
import { API } from '../libs/Api';

export default class Message extends React.Component {

    constructor(){
        super();

        this.state = {
            name : "",
            email : "",
            phone : "",
            subject : "",
            description : "",
        }
    }

    componentDidMount(){
        API.putMessageRead(this.props.messageId);
        API.getMessage(this.props.messageId, this);
    }

    render(){
        return <ReactModal 
                    isOpen={true}
                    contentLabel="onRequestClose Example"
                    className="message-modal" >
                    
                    <div className="form-row">
                        <div className="col-10">
                            <p><span>From: </span>{this.state.name}</p>
                        </div>
                        <div className="col-2">
                            <p><span>Phone: </span>{this.state.phone}</p>
                        </div>
                    </div>
                    <div className="form-row">
                        <div className="col-12">
                            <p><span>Email: </span>{this.state.email}</p>
                        </div>
                    </div>
                    <div className="form-row">
                        <div className="col-12">
                            <p><span>{this.state.subject}</span></p>
                        </div>
                    </div>
                    <div className="form-row">
                        <div className="col-12">
                            <p>{this.state.description}</p>
                        </div>
                    </div>
                    <div className="form-row">
                        <div className="col-12">
                            <button className="btn btn-outline-primary" onClick={() => this.props.closeMessage()}>Close</button>
                        </div>
                    </div>
                </ReactModal>
    }

}