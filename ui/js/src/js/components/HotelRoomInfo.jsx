import React from 'react';

export default class HotelRoomInfo extends React.Component {

    constructor(){
        super();
    }

    render(){
        return(
            <div className="row hotel-room-info">
                <div className="col-sm-1"></div>
                <div className="col-sm-3">
                    <img className="img-responsive hotel-img" src={this.props.room.image} alt={"Preview image of room" + this.props.room.roomNumber} />
                </div>
                <div className="col-sm-7">
                    {this.props.room.accessible && <span className="fa fa-wheelchair wheelchair"></span>}
                    <h3>{this.props.room.type}</h3>
                    <p>{this.props.room.description}</p>
                    <ul>
                        {this.props.room.features.map((feature, index) => {
                            return <li key={index}>{feature}</li>
                        })}
                    </ul>
                </div>
                <div className="col-sm-1"></div>
            </div>
        )
    }

}