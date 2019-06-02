package com.automationintesting.utils;

import com.automationintesting.model.Booking;
import com.automationintesting.model.Message;

import java.text.SimpleDateFormat;

public class MessageBuilder {

    public Message build(Booking booking) {
        SimpleDateFormat dateFormat = new SimpleDateFormat("yyyy-MM-dd");

        String name = booking.getFirstname() + " " + booking.getLastname();
        String description = "You have a new booking from " + name + ". They have booked a room for the following dates: " + dateFormat.format(booking.getBookingDates().getCheckin()) + " to " + dateFormat.format(booking.getBookingDates().getCheckout());
        String email = booking.getEmail().get();
        String phone = booking.getPhone().get();

        return new Message(name, email, phone, "You have a new booking!", description);
    }

}
