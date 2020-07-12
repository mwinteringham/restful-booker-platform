import React from 'react';
import { API } from '../libs/Api.js';
import Message from './Message.jsx';

export default class MessageList extends React.Component {

    constructor() {
        super();

        this.state = {
            messageId : 0,
            messages : []
        }

        this.deleteMessage = this.deleteMessage.bind(this);
        this.refreshMessageList = this.refreshMessageList.bind(this);
        this.openMessage = this.openMessage.bind(this);
        this.closeMessage = this.closeMessage.bind(this);
    }

    componentDidMount() {
        this.refreshMessageList()
    }

    deleteMessage(id) {
        API.deleteMessage(id, this);

        this.props.setCount();
    }

    refreshMessageList(){
        API.getMessages(this);
    }

    openMessage(id){
        this.setState({messageId : id});
    }

    closeMessage(){
        this.refreshMessageList();
        this.setState({messageId : 0});

        this.props.setCount();
    }

    render() {
        return <div>
            {this.state.messageId > 0 && 
                <Message messageId={this.state.messageId} closeMessage={this.closeMessage} refreshMessageList={this.refreshMessageList} />
            }
            <div className="messages">
                <div className="row">
                    <div className="col-sm-2 rowHeader"><p>Name</p></div>
                    <div className="col-sm-9 rowHeader"><p>Subject</p></div>
                    <div className="col-sm-1"></div>
                </div>
                {this.state.messages.map((value, index) => {
                    return  <div className={"row detail read-" + value.read} id={"message" + index} key={index}>
                                <div className="col-sm-2" onClick={() => this.openMessage(value.id)}><p>{value.name}</p></div>
                                <div className="col-sm-9" onClick={() => this.openMessage(value.id)}><p>{value.subject}</p></div>
                                <div className="col-sm-1">
                                <span className="fa fa-remove roomDelete" onClick={() => this.deleteMessage(value.id)}></span>
                                </div>
                            </div>
                })}
            </div>
        </div>
    }

}