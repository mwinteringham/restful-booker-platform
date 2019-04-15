import React from 'react';
import { API_ROOT } from '../api-config';
import BigCalendar from 'react-big-calendar';
import moment from 'moment';

const fetch = require('node-fetch');

import "react-big-calendar/lib/css/react-big-calendar.css";

export default class Report extends React.Component {

  constructor(){
    super();
    
    this.state = {
      report : [],
      currentTimestamp : moment
    }
  }

  componentDidMount(){
    fetch(API_ROOT + '/report/')
      .then(res => res.json())
      .then(body => {
        this.setState({ report : body.report });
      });
  }

  render(){
    const localizer = BigCalendar.momentLocalizer(this.state.currentTimestamp);

    return <div>
      <BigCalendar
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