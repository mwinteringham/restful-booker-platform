package api;

import model.report.RoomReportDate;

import java.util.Calendar;
import java.util.Date;
import java.util.GregorianCalendar;
import java.util.List;

public class DateRange {

    public static List<RoomReportDate> parse(List<RoomReportDate> dates, Date startdate, Date enddate) {
        Calendar calendar = new GregorianCalendar();
        calendar.setTime(startdate);

        while (calendar.getTime().before(enddate)) {
            Date result = calendar.getTime();
            dates.add(new RoomReportDate(result));
            calendar.add(Calendar.DATE, 1);
        }

        dates.add(new RoomReportDate(enddate));

        return dates;
    }

}
