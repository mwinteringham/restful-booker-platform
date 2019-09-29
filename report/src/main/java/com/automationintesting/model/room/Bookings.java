package com.automationintesting.model.room;

import com.fasterxml.jackson.annotation.JsonProperty;

import java.util.List;

public class Bookings {

    @JsonProperty
    private List<Booking> bookings;

    public Bookings() {
    }

    public Bookings(List<Booking> bookings) {
        this.bookings = bookings;
    }

    public List<Booking> getBookings() {
        return bookings;
    }

    public void setBookings(List<Booking> bookings) {
        this.bookings = bookings;
    }
}
