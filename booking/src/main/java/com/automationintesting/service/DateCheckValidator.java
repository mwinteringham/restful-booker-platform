package com.automationintesting.service;

import com.automationintesting.model.db.BookingDates;

import java.time.LocalDate;

public class DateCheckValidator {

    public boolean isValid(BookingDates dateBooking) {
        final LocalDate checkin = dateBooking.getCheckin();
        final LocalDate checkout =  dateBooking.getCheckout();

        if (checkin == null || checkout == null) {
            return false;
        }

        return checkin.compareTo(checkout) < 0;
    }

}
