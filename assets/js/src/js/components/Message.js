import React, { useEffect, useState } from 'react';
import ReactModal from 'react-modal';
import { API } from '../libs/Api';

const Message = ({messageId, closeMessage, refreshMessageList}) => {

    const [message, setMessage] = useState({
            name : "",
            email : "",
            phone : "",
            subject : "",
            description : ""
        })

    useEffect(() => {
        API.putMessageRead(messageId);
        API.getMessage(messageId, setMessage);
    }, [])
    
    return <ReactModal 
                isOpen={true}
                ariaHideApp={false}
                contentLabel="onRequestClose Example"
                className="message-modal" >
                
                <div data-testid="message">
                    <div className="form-row">
                        <div className="col-10">
                            <p><span>From: </span>{message.name}</p>
                        </div>
                        <div className="col-2">
                            <p><span>Phone: </span>{message.phone}</p>
                        </div>
                    </div>
                    <div className="form-row">
                        <div className="col-12">
                            <p><span>Email: </span>{message.email}</p>
                        </div>
                    </div>
                    <div className="form-row">
                        <div className="col-12">
                            <p><span>{message.subject}</span></p>
                        </div>
                    </div>
                    <div className="form-row">
                        <div className="col-12">
                            <p>{message.description}</p>
                        </div>
                    </div>
                    <div className="form-row">
                        <div className="col-12">
                            <button className="btn btn-outline-primary" onClick={() => closeMessage()}>Close</button>
                        </div>
                    </div>
                </div>
            </ReactModal>

}

export default Message;
