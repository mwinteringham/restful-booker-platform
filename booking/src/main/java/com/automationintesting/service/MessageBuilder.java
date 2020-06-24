package com.automationintesting.service;

import com.automationintesting.model.db.Booking;
import com.automationintesting.model.db.Message;

public class MessageBuilder {

    public Message build(Booking booking) {
        String name = booking.getFirstname() + " " + booking.getLastname();
        String description = "You have a new booking from " + name + ". They have booked a room for the following dates: " + booking.getBookingDates().getCheckin().toString() + " to " + booking.getBookingDates().getCheckout().toString();
        String email = booking.getEmail().get();
        String phone = booking.getPhone().get();

        return new Message(name, email, phone, "You have a new booking!", description);
    }

}
