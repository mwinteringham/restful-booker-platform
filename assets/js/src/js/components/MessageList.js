import React, { useEffect, useState } from 'react';
import { API } from '../libs/Api.js';
import Message from './Message.js';

const MessageList = ({setCount}) => {

    const [messageId, setMessageId] = useState(0);
    const [messages, setMessages] = useState([]);

    useEffect(() => {
        refreshMessageList()
    }, [])

    const deleteMessage = (id) => {
        API.deleteMessage(id, refreshMessageList);

        setCount();
    }

    const refreshMessageList = () => {
        API.getMessages(setMessages);
    }

    const openMessage = (id) => {
        setMessageId(id);
    }

    const closeMessage = () => {
        refreshMessageList();
        setMessageId(0);

        setCount();
    }

    return <div>
        {messageId > 0 && 
            <Message messageId={messageId} closeMessage={closeMessage} refreshMessageList={refreshMessageList} />
        }
        <div className="messages">
            <div className="row">
                <div className="col-sm-2 rowHeader"><p>Name</p></div>
                <div className="col-sm-9 rowHeader"><p>Subject</p></div>
                <div className="col-sm-1"></div>
            </div>
            {messages.map((value, index) => {
                return  <div className={"row detail read-" + value.read} id={"message" + index} key={index}>
                            <div className="col-sm-2" data-testid={"message" + index} onClick={() => openMessage(value.id)}><p>{value.name}</p></div>
                            <div className="col-sm-9" data-testid={"messageDescription" + index} onClick={() => openMessage(value.id)}><p>{value.subject}</p></div>
                            <div className="col-sm-1">
                            <span data-testid={"DeleteMessage" + index} className="fa fa-remove roomDelete" onClick={() => deleteMessage(value.id)}></span>
                            </div>
                        </div>
            })}
        </div>
    </div>

}

export default MessageList;
