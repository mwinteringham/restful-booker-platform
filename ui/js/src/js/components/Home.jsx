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
            rooms : []
        }
    }

    componentDidMount() {
        fetch(API_ROOT + '/branding/', {
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

        fetch(API_ROOT + '/room/', {
            method: 'GET',
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json'
            }
        })
        .then(res => res.json())
        .then(res => {
            this.setState({rooms : res.rooms});
        })
        .catch(e => console.log(e));
    }

    render() {
        return (
            <div>
                <div className="container-fluid">
                    <div className="row">
                        <div className='col-sm-12 text-center'>
                            <HotelLogo logoDetails={this.state.logoUrl} />
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
                        <div className='col-sm-12'>
                            <HotelMap name={this.state.name} mapDetails={this.state.map} />
                        </div>
                    </div>
                </div>
            </div>
        );
    }
}
