import React, { useEffect, useState } from 'react';
import { Calendar, momentLocalizer} from 'react-big-calendar';
import moment from 'moment/moment';
import AdminBooking from './AdminBooking.js';

import "react-big-calendar/lib/css/react-big-calendar.css";
import { API } from '../libs/Api';

const Report = ({defaultDate}) => {

  const [report, setReport] = useState([]);
  const [showBookingForm, toggleBookingForm] = useState(false);
  const [dates, setDates] = useState(null);

  useEffect(() => {
    API.getReport(setReport);
  }, [])

  const addBooking = (result) => {
    if(result.slots.length > 1){
      setDates(result);
      toggleBookingForm(true);
    }
  }

  const closeBooking = () => {
    toggleBookingForm(false);

    API.getReport(setReport);
  }

  const localizer = momentLocalizer(moment);

  if(showBookingForm){
    return <AdminBooking closeBooking={closeBooking} dates={dates} />
  } else {
    return <div>
      <Calendar
        defaultDate={defaultDate}
        onSelectSlot={addBooking}
        selectable
        localizer={localizer}
        defaultView="month"
        popup={true}
        events={report}
        style={{ height: "75vh" }}
        views={['month']}
      />
    </div>
  }
}

export default Report;
