import React from 'react';

const HotelLogo = ({logoDetails}) => {

    if(logoDetails){
        return (<img src={logoDetails} className='hotel-logoUrl' alt='Hotel logoUrl' />)
    } else {
        return (<p>ERROR: Url link not provided</p>)
    }

}

export default HotelLogo;