package com.automationintesting.validators;

import com.automationintesting.model.BookingDates;

import java.util.Date;

public class DateCheckValidator {

    public boolean isValid(BookingDates dateBooking) {
        final Date checkin = dateBooking.getCheckin();
        final Date checkout =  dateBooking.getCheckout();

        if (checkin == null || checkout == null) {
            return false;
        }

        return checkin.compareTo(checkout) < 0;
    }

}
