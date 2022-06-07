package com.automationintesting.model.booking;

import com.fasterxml.jackson.annotation.JsonProperty;

import java.util.List;

public class BookingSummaries {

    @JsonProperty
    private List<BookingSummary> bookings;

    public BookingSummaries(List<BookingSummary> bookings) {
        this.bookings = bookings;
    }

    public BookingSummaries() {
    }

    public List<BookingSummary> getBookings() {
        return bookings;
    }

    public void setBookings(List<BookingSummary> bookings) {
        this.bookings = bookings;
    }
}
