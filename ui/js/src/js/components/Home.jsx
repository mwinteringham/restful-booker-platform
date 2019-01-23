import React from 'react';
import fetch from 'node-fetch';
import RoomInfo from './RoomInfo.jsx';
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
