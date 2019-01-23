import React from 'react';

export default class HotelContact extends React.Component {

    render(){
        if(this.props.contact){
            return <div className='row'>
                        <div className='col-sm-1'></div>
                        <div className='col-sm-5'>
                            <p>Form</p>
                        </div>
                        <div className='col-sm-5'>
                            <p><span className="glyphicon glyphicon-home"></span> {this.props.contact.name}</p>
                            <p><span></span> {this.props.contact.address}</p>
                            <p><span className="glyphicon glyphicon-earphone"></span> {this.props.contact.phone}</p>
                            <p><span className="glyphicon glyphicon-envelope"></span> {this.props.contact.email}</p>
                        </div>
                        <div className='col-sm-1'></div>
                    </div>
        } else {
            return <p>ERROR: Missing contact details to render</p>
        }
    }

}