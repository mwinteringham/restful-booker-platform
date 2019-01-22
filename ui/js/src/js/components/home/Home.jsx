import React from 'react';
import RoomInfo from './RoomInfo.jsx';
import HotelMap from './HotelMap.jsx';
import HotelLogo from './HotelLogo.jsx';
import HotelContact from './HotelContact.jsx';

export default class Home extends React.Component {

    constructor() {
        super();

        this.state = {
            rooms : [{
                roomid: 1,
                roomNumber: 101,
                type: 'Twin',
                beds: 2,
                accessible: false,
                details: 'Wifi, TV, Mini-bar'
            },{
                roomid: 2,
                roomNumber: 102,
                type: 'Single',
                beds: 1,
                accessible: true,
                details: 'Walk in shower'
            }],
            map : {
                hotelName : 'Shady meadows B&B',
                latitude : 52.6351204,
                longitude : 1.2733774
            },
            logo : {
                url : 'https://www.mwtestconsultancy.co.uk/img/rbp-logo.png'
            },
            description : "Welcome to Shady Meadows, a delightful Bed & Breakfast nestled in the hills on Newingtonfordburyshire. A place so beautiful you will never want to leave. All our rooms have comfortable beds and we provide breakfast from the locally sourced supermarket. It's a delightful place.",
            contact : {
                name : 'Shady Meadows B&B',
                address : 'The Old Farmhouse, Shady Street, Newfordburyshire, NE1 410S',
                phone : '0123456789',
                email : 'fake@fakeemail.com'
            }
        }
    }

	render() {
    	return(
			<div>
                <div className="row">
                    <div className='col-sm-12 text-center'>
                        <HotelLogo logoDetails={this.state.logo} />
                    </div>
                </div>
                <div className="row hotel-description">
                    <div className='col-sm-2'></div>
                    <div className='col-sm-8'>
                        <p>{this.state.description}</p>
                    </div>
                    <div className='col-sm-2'></div>
                </div>
                {this.state.rooms.map((roomDetails) => {
					return <div key={roomDetails.roomid}><RoomInfo room={roomDetails} /></div>
				})}
                <div className="row">
                    <div className='col-sm-12'>
                        <HotelContact contact={this.state.contact} />
                    </div>
                </div>
                <div className="row">
                    <div className="col-sm-12">
                        <HotelMap mapDetails={this.state.map}/>
                    </div>
                </div>
            </div>
      );
    }
}