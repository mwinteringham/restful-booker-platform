import React from 'react';

export default class HotelContact extends React.Component {

    render(){
        if(this.props.contact){
            return <div>
                        <ul>
                            <li>{this.props.contact.name}</li>
                            <li>{this.props.contact.address}</li>
                            <li>{this.props.contact.phone}</li>
                            <li>{this.props.contact.email}</li>
                        </ul>
                    </div>
        } else {
            return <p>ERROR: Missing contact details to render</p>
        }
    }

}