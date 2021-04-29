package com.automationintesting.unit.service;

import com.automationintesting.model.report.Report;
import com.automationintesting.model.room.*;
import com.automationintesting.requests.BookingRequests;
import com.automationintesting.requests.RoomRequests;
import com.automationintesting.service.ReportService;

import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.MockitoAnnotations;
import org.springframework.beans.factory.annotation.Autowired;

import java.util.ArrayList;
import java.util.Calendar;
import java.util.GregorianCalendar;

import static org.junit.jupiter.api.Assertions.assertEquals;
import static org.mockito.Mockito.when;

public class ReportServiceTest {

    @Mock
    private RoomRequests roomRequests;

    @Mock
    private BookingRequests bookingRequests;

    @InjectMocks
    @Autowired
    private ReportService reportService;

    @BeforeEach
    public void initialiseMocks() {
        MockitoAnnotations.openMocks(this);

        Room roomOne = new Room(1, 101, "Single", 1, true, "Wifi");
        Room roomTwo = new Room(2, 102, "Double", 2, true, "Mini-bar");

        Rooms sampleRooms = new Rooms(new ArrayList<>(){{
            this.add(roomOne);
            this.add(roomTwo);
        }});

        Calendar startDate = new GregorianCalendar(2019, Calendar.SEPTEMBER, 1);
        Calendar endDate = new GregorianCalendar(2019, Calendar.SEPTEMBER, 2);

        BookingDates bookingDates = new BookingDates(startDate.getTime(), endDate.getTime());
        Booking bookingOne = new Booking(1, 1, "Mark", "Dean", true, bookingDates);
        Booking bookingTwo = new Booking(2, 2, "James", "Jones", true, bookingDates);

        Bookings bookingsOne = new Bookings(new ArrayList<>(){{
            this.add(bookingOne);
        }});

        Bookings bookingsTwo = new Bookings(new ArrayList<>(){{
            this.add(bookingTwo);
        }});

        when(roomRequests.searchForRooms()).thenReturn(sampleRooms);
        when(bookingRequests.getBookings(1)).thenReturn(bookingsOne);
        when(bookingRequests.getBookings(2)).thenReturn(bookingsTwo);
    }

    @Test
    public void getAllRoomReportTest(){
        Report report = reportService.getAllRoomsReport();

        assertEquals(report.toString(), "Report{report=[Entry{start=2019-09-01, end=2019-09-02, title='Mark Dean - Room: 101'}, Entry{start=2019-09-01, end=2019-09-02, title='James Jones - Room: 102'}]}");
    }

    @Test
    public void getSpecificRoomReportTest(){
        Report report = reportService.getSpecificRoomReport(1);

        assertEquals(report.toString(), "Report{report=[Entry{start=2019-09-01, end=2019-09-02, title='Unavailable'}]}");
    }

}
