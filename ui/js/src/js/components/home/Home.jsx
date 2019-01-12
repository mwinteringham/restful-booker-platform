import React from 'react';
import RoomInfo from './RoomInfo.jsx';
import HotelMap from './HotelMap.jsx';

export default class Home extends React.Component {

    constructor() {
        super();

        this.state = {
            rooms : [{
                roomid: 1,
                roomNumber: 101,
                type: "Twin",
                beds: 2,
                accessible: false,
                details: "Wifi, TV, Mini-bar"
            },{
                roomid: 2,
                roomNumber: 102,
                type: "Single",
                beds: 1,
                accessible: true,
                details: "Walk in shower"
            }],
            map : {
                hotelName : 'Shady meadows B&B',
                latitude : 52.6351204,
                longitude : 1.2733774
            }
        }
    }

	render() {
    	return(
			<div>
                <div className="row">
                    <div className='col-sm-4'></div>
                    <div className='col-sm-4'>
                        <h1>Hotel logo</h1>
                    </div>
                    <div className='col-sm-4'></div>
                </div>
                <div className="row">
                    <div className='col-sm-4'></div>
                    <div className='col-sm-4'>
                        <hr />
                        <h2>Hotel description</h2>
                    </div>
                    <div className='col-sm-4'></div>
                </div>
                <div className="row">
                    <div className='col-sm-4'></div>
                    <div className='col-sm-4'>
                        <hr />
                        <h2>Rooms listing</h2>
                    </div>
                    <div className='col-sm-4'></div>
                </div>
                {this.state.rooms.map((roomDetails) => {
					return <div key={roomDetails.roomid}><RoomInfo room={roomDetails} /></div>
				})}
                <div className="row">
                    <div className='col-sm-4'></div>
                    <div className='col-sm-4'>
                        <hr />
                        <h3>Location</h3>
                    </div>
                    <div className='col-sm-4'></div>
                </div>
                <div className="row">
                    <div className="col-sm-12">
                        <HotelMap mapDetails={this.state.map}/>
                    </div>
                </div>
                <div className="row">
                    <div className='col-sm-4'></div>
                    <div className='col-sm-4'>
                        <hr />
                        <h4>Footer</h4>
                    </div>
                    <div className='col-sm-4'></div>
                </div>
            </div>
      );
    }
}
