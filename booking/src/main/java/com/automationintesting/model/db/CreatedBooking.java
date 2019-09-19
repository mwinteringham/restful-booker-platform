package com.automationintesting.model.db;

import com.automationintesting.model.db.Booking;
import com.fasterxml.jackson.annotation.JsonProperty;

public class CreatedBooking {

    @JsonProperty
    private int bookingid;

    @JsonProperty
    private Booking booking;

    public CreatedBooking(int bookingid, Booking booking) {
        this.bookingid = bookingid;
        this.booking = booking;
    }

    public CreatedBooking() {
    }

    public int getBookingid() {
        return bookingid;
    }

    public void setBookingid(int bookingid) {
        this.bookingid = bookingid;
    }

    public Booking getBooking() {
        return booking;
    }

    public void setBooking(Booking booking) {
        this.booking = booking;
    }

    @Override
    public String toString() {
        return "CreatedBooking{" +
                "bookingid=" + bookingid +
                ", booking=" + booking.toString() +
                '}';
    }

}
