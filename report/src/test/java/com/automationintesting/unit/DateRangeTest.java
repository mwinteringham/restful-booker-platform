package com.automationintesting.unit;

import api.DateRange;
import model.report.RoomReportDate;
import org.approvaltests.Approvals;
import org.junit.Test;

import java.text.ParseException;
import java.text.SimpleDateFormat;
import java.util.ArrayList;
import java.util.Date;
import java.util.List;

public class DateRangeTest {

    @Test
    public void testDateRange() throws ParseException {
        SimpleDateFormat simpleDateFormat = new SimpleDateFormat("yyyy-MM-dd");
        Date checkin = simpleDateFormat.parse("2018-01-01");
        Date checkout = simpleDateFormat.parse("2018-01-05");

        List<RoomReportDate> dateList = new ArrayList<>();

        dateList = DateRange.parse(dateList, checkin, checkout);

        Approvals.verify(dateList);
    }

}
