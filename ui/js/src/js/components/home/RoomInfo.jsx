import React from 'react';

export default class RoomInfo extends React.Component {

    constructor(){
        super();
    }

    render(){
        return(
            <div class="row">
                <div class="col-sm-12">
                    <p>{this.props.room.type}</p>
                    <p>{this.props.room.beds}</p>
                    <p>{this.props.room.accessible}</p>
                    <p>{this.props.room.details}</p>
                </div>
            </div>
        )
    }

}