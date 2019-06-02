import React from 'react';
import BigCalendar from 'react-big-calendar';
import moment from 'moment';
import AdminBooking from './AdminBooking.jsx';

const fetch = require('node-fetch');

import "react-big-calendar/lib/css/react-big-calendar.css";
import { API } from '../libs/Api';

export default class Report extends React.Component {

  constructor(){
    super();
    
    this.state = {
      report : [],
      currentTimestamp : moment, 
      showBookingForm : false,
      dates : null
    }

    this.addBooking = this.addBooking.bind(this);
    this.closeBooking = this.closeBooking.bind(this);
  }

  componentDidMount(){
    API.getReport(this);
  }

  addBooking(result){
    if(result.slots.length > 1){
      this.setState({showBookingForm : true, dates : result});
    }
  }

  closeBooking(){
    this.setState({showBookingForm : false});
    API.getReport(this);
  }

  render(){
    const localizer = BigCalendar.momentLocalizer(this.state.currentTimestamp);

    if(this.state.showBookingForm){
      return <AdminBooking closeBooking={this.closeBooking} dates={this.state.dates} />
    } else {
      return <div>
        <BigCalendar
          onSelectSlot={this.addBooking}
          selectable
          localizer={localizer}
          defaultView="month"
          popup={true}
          events={this.state.report}
          style={{ height: "75vh" }}
          views={['month']}
        />
      </div>
    }
  }
}