import React from 'react';
import fetch from 'node-fetch';
import HotelRoomInfo from './HotelRoomInfo.jsx';
import HotelMap from './HotelMap.jsx';
import HotelLogo from './HotelLogo.jsx';
import HotelContact from './HotelContact.jsx';
import { API_ROOT } from '../api-config';

export default class Home extends React.Component {

    constructor() {
        super();

        this.state = {
            rooms : [{
                roomid: 1,
                roomNumber: 101,
                type: 'Standard Room',
                beds: 2,
                accessible: false,
                image : 'https://www.mwtestconsultancy.co.uk/img/room1.jpg',
                description: 'Aenean porttitor mauris sit amet lacinia molestie. In posuere accumsan aliquet. Maecenas sit amet nisl massa. Interdum et malesuada fames ac ante.',
                features: [
                    'Internet/Wi-fi',
                    'Jacuzzi Bathroom',
                    'Air conditioning',
                    'High Definition TV',
                    'Mini-bar'
                ]
            },{
                roomid: 2,
                roomNumber: 102,
                type: 'Single',
                beds: 1,
                accessible: true,
                image: 'https://www.mwtestconsultancy.co.uk/img/room2.jpg',
                description: 'Aenean porttitor mauris sit amet lacinia molestie. In posuere accumsan aliquet. Maecenas sit amet nisl massa. Interdum et malesuada fames ac ante.',
                features: [
                    'Internet/Wi-fi',
                    'Air conditioning',
                    'Mini-bar'
                ]
            }]
        }
    }

    componentDidMount() {
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
                    <div className="row room-header">
                        <div className='col-sm-1'></div>
                        <div className='col-sm-10'>
                            <h2>Rooms</h2>
                        </div>
                        <div className='col-sm-1'></div>
                    </div>
                    {this.state.rooms.map((roomDetails) => {
                        return <div key={roomDetails.roomid}><HotelRoomInfo room={roomDetails} /></div>
                    })}
                        <HotelContact contact={this.state.contact} />
                    <div className="row">
                        <div className='col-sm-12'></div>
                        <HotelMap mapDetails={this.state.map} />
                    </div>
                </div>
            </div>
        );
    }
}
