package com.automationintesting.model.service;

import com.automationintesting.model.db.Booking;
import com.automationintesting.model.db.CreatedBooking;
import org.springframework.http.HttpStatus;

public class BookingResult {

    private Booking booking;

    private CreatedBooking createdBooking;

    private HttpStatus result;

    public BookingResult(Booking booking, HttpStatus result) {
        this.booking = booking;
        this.result = result;
    }

    public BookingResult(CreatedBooking createdBooking, HttpStatus result) {
        this.createdBooking = createdBooking;
        this.result = result;
    }

    public BookingResult(HttpStatus result) {
        this.result = result;
    }

    public HttpStatus getStatus() {
        return result;
    }

    public Booking getBooking() {
        return booking;
    }

    public CreatedBooking getCreatedBooking() {
        return createdBooking;
    }
}
