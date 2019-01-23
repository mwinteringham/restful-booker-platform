import React from 'react';
import RoomInfo from './RoomInfo.jsx';
import HotelMap from './HotelMap.jsx';
import HotelLogo from './HotelLogo.jsx';
import HotelContact from './HotelContact.jsx';
import { API_ROOT } from '../../api-config';

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
            }]
        }
    }

    componentDidMount() {
        // const data = {
        //     map: {
        //         hotelName: 'Shady meadows B&B',
        //         latitude: 52.6351204,
        //         longitude: 1.2733774
        //     },
        //     logo: {
        //         url: 'https://www.mwtestconsultancy.co.uk/img/rbp-logo.png'
        //     },
        //     description: "Welcome to Shady Meadows, a delightful Bed & Breakfast nestled in the hills on Newingtonfordburyshire. A place so beautiful you will never want to leave. All our rooms have comfortable beds and we provide breakfast from the locally sourced supermarket. It's a delightful place.",
        //     contact: {
        //         name: 'Shady Meadows B&B',
        //         address: 'The Old Farmhouse, Shady Street, Newfordburyshire, NE1 410S',
        //         phone: '0123456789',
        //         email: 'fake@fakeemail.com'
        //     }
        // }
        fetch(API_ROOT.branding + '/branding/', {
			method: 'GET',
			headers: {
				'Accept': 'application/json',
				'Content-Type': 'application/json'
			}
        })
        .then(res => res.json())
        .then(res => {
            this.setState(res);
        })
        .catch(e => console.log(e));
    }

    render() {
        return (
            <div>
                <div className="container-fluid">
                    <div className="row">
                        <div className='col-sm-12 text-center'>
                            <HotelLogo logoDetails={this.state.logo} />
                        </div>
                    </div>
                    <div className="row hotel-description">
                        <div className='col-sm-1'></div>
                        <div className='col-sm-10'>
                            <p>{this.state.description}</p>
                        </div>
                        <div className='col-sm-1'></div>
                    </div>
                    {this.state.rooms.map((roomDetails) => {
                        return <div key={roomDetails.roomid}><RoomInfo room={roomDetails} /></div>
                    })}
                    <div className="row">
                        <HotelContact contact={this.state.contact} />
                    </div>
                    <div className="row">
                        <div className='col-sm-12'></div>
                        <HotelMap mapDetails={this.state.map} />
                    </div>
                </div>
            </div>
        );
    }
}
