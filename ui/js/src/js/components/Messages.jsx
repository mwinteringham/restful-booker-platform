import React from 'react';
import { API } from '../libs/Api.js';

export default class Messages extends React.Component {

    constructor() {
        super();

        this.state = {
            messages : []
        }

        this.deleteMessage = this.deleteMessage.bind(this);
        this.refreshMessageList = this.refreshMessageList.bind(this);
    }

    componentDidMount() {
        this.refreshMessageList()
    }

    deleteMessage(id) {
        API.deleteMessage(id, this);
    }

    refreshMessageList(){
        API.getMessages(this);
    }

    render() {
        return <div class="messages">
            <div className="row">
                <div className="col-sm-2 rowHeader"><p>Name</p></div>
                <div className="col-sm-9 rowHeader"><p>Subject</p></div>
                <div className="col-sm-1"></div>
            </div>
            {this.state.messages.map((value, index) => {
                return  <div className="row detail" key={index}>
                            <div className="col-sm-2"><p>{value.name}</p></div>
                            <div className="col-sm-9"><p>{value.subject}</p></div>
                            <div className="col-sm-1">
                            <span className="fa fa-remove roomDelete"></span>
                            </div>
                        </div>
            })}
        </div>
    }

}