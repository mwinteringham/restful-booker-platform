package com.automationintesting.model;

import com.fasterxml.jackson.annotation.JsonProperty;

import java.util.List;

public class BookingResults {

    @JsonProperty
    private List<Booking> bookings;

    public BookingResults(List<Booking> bookings) {
        this.bookings = bookings;
    }

    public BookingResults() {
    }

    public List<Booking> getBookings() {
        return bookings;
    }

    public void setBookings(List<Booking> bookings) {
        this.bookings = bookings;
    }
}
