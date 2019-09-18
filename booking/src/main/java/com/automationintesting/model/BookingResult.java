package com.automationintesting.model;

import org.springframework.http.HttpStatus;

public class BookingResult {

    private Booking booking;

    private HttpStatus result;

    public BookingResult(Booking booking, HttpStatus result) {
        this.booking = booking;
        this.result = result;
    }

    public HttpStatus getStatus() {
        return result;
    }

    public Booking getBooking() {
        return booking;
    }
}
