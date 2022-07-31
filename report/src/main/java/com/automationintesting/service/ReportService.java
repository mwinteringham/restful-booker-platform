package com.automationintesting.service;

import com.automationintesting.model.booking.BookingSummaries;
import com.automationintesting.model.booking.BookingSummary;
import com.automationintesting.model.report.Entry;
import com.automationintesting.model.report.Report;
import com.automationintesting.model.booking.Booking;
import com.automationintesting.model.booking.Bookings;
import com.automationintesting.model.room.Room;
import com.automationintesting.requests.BookingRequests;
import com.automationintesting.requests.RoomRequests;
import org.springframework.stereotype.Service;

import java.util.ArrayList;
import java.util.List;

@Service
public class ReportService {

    private RoomRequests roomRequests;
    private BookingRequests bookingRequests;

    public ReportService() {
        roomRequests = new RoomRequests();
        bookingRequests = new BookingRequests();
    }

    public Report getAllRoomsReport(String token) {
        List<Room> rooms = roomRequests.searchForRooms().getRooms();
        List<Entry> parsedRooms = new ArrayList<>();

        for(Room r : rooms){
            Bookings roomBookings = bookingRequests.getBookings(r.getRoomid(), token);

            for(Booking b : roomBookings.getBookings()){
                Entry entry = new Entry(b.getBookingDates().getCheckin(), b.getBookingDates().getCheckout(), b.getFirstname() + " " + b.getLastname() + " - Room: " + r.getRoomName());
                parsedRooms.add(entry);
            }
        }

        return new Report(parsedRooms);
    }

    public Report getSpecificRoomReport(int roomId) {
        List<Entry> parsedRooms = new ArrayList<Entry>();

        BookingSummaries roomBookings = bookingRequests.getBookingSummaries(roomId);

        for(BookingSummary b : roomBookings.getBookings()){
            Entry entry = new Entry(b.getBookingDates().getCheckin(), b.getBookingDates().getCheckout(), "Unavailable");
            parsedRooms.add(entry);
        }

        return new Report(parsedRooms);
    }
}
