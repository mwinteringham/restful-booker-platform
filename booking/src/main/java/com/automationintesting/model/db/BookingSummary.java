package com.automationintesting.model.db;

import java.sql.ResultSet;
import java.sql.SQLException;

public class BookingSummary {

    private BookingDates bookingDates;

    public BookingSummary() {
    }

    public BookingSummary(BookingDates bookingDates) {
        this.bookingDates = bookingDates;
    }

    public BookingSummary(ResultSet result) throws SQLException {
        this.bookingDates = new BookingDates(result.getDate("checkin").toLocalDate(), result.getDate("checkout").toLocalDate());
    }

    public BookingDates getBookingDates() {
        return bookingDates;
    }

    public void setBookingDates(BookingDates bookingDates) {
        this.bookingDates = bookingDates;
    }
}
