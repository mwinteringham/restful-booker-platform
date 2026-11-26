import React, { useEffect, useState } from 'react';
import { Calendar, momentLocalizer } from 'react-big-calendar';
import moment from 'moment';
import AdminBooking from './AdminBooking';

import "react-big-calendar/lib/css/react-big-calendar.css";

interface ReportProps {
  defaultDate: Date;
}

interface BookingDates {
  slots: Date[];
  start: Date;
  end: Date;
}

interface ReportEvent {
  title: string;
  start: Date;
  end: Date;
}

const Report: React.FC<ReportProps> = ({ defaultDate }) => {
  const [report, setReport] = useState<ReportEvent[]>([]);
  const [showBookingForm, toggleBookingForm] = useState(false);
  const [dates, setDates] = useState<BookingDates | null>(null);

  useEffect(() => {
    const fetchReport = async () => {
      try {
        const response = await fetch('/ui-api/report');
        if (response.ok) {
          const data = await response.json();

          setReport(data.report);
        }
      } catch (error) {
        console.error('Error fetching report:', error);
      }
    };

    fetchReport();
  }, []);

  const addBooking = (result: BookingDates) => {
    if (result.slots.length > 1) {
      setDates(result);
      toggleBookingForm(true);
    }
  };

  const closeBooking = async () => {
    
    // Refresh report data
    try {
      const response = await fetch('/ui-api/report');
      if (response.ok) {
        const data = await response.json();
        
        setReport(data.report);
        toggleBookingForm(false);
      }
    } catch (error) {
      console.error('Error refreshing report:', error);
    }
  };

  const localizer = momentLocalizer(moment);

  if (showBookingForm) {
    return <AdminBooking closeBooking={closeBooking} dates={dates} />;
  }

  return (
    <div>
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
  );
};

export default Report; 