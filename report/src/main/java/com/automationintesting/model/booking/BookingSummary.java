package com.automationintesting.model.booking;

public class BookingSummary {

    private BookingDates bookingDates;

    public BookingSummary() {
    }

    public BookingSummary(BookingDates bookingDates) {
        this.bookingDates = bookingDates;
    }

    public BookingDates getBookingDates() {
        return bookingDates;
    }

    public void setBookingDates(BookingDates bookingDates) {
        this.bookingDates = bookingDates;
    }
}
