import React from 'react';

export default class HotelLogo extends React.Component {

    render(){
        if(this.props.logoDetails){
            return <img src={this.props.logoDetails.url} className='hotel-logo' alt='Hotel logo' />
        } else {
            return <p>ERROR: Url link not provided</p>
        }
    }

}