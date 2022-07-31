package com.automationintesting.unit.service;

import com.automationintesting.model.db.BookingDates;
import com.automationintesting.service.DateCheckValidator;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;

import java.sql.Date;

import static org.hamcrest.MatcherAssert.assertThat;

public class DateCheckValidatorTest {

    private DateCheckValidator dateCheckValidator;
    private BookingDates bookingDates;

    @BeforeEach
    public void setup() {
        dateCheckValidator = new DateCheckValidator();
        bookingDates = new BookingDates();
    }

    @Test
    public void invalidIfDatesNotProvided() {
        boolean validDate = dateCheckValidator.isValid(bookingDates);

        assertThat("Should be invalid if dates not provided", !validDate);
    }

    @Test
    public void invalidIfCheckinAfterCheckout() {
        bookingDates.setCheckout(Date.valueOf("2018-01-01").toLocalDate());
        bookingDates.setCheckin(Date.valueOf("2018-01-05").toLocalDate());

        boolean validDate = dateCheckValidator.isValid(bookingDates);

        assertThat("Should be invalid if checkin after checkout", !validDate);
    }

    @Test
    public void invalidIfCheckinAndCheckoutSameDay() {
        bookingDates.setCheckout(Date.valueOf("2018-01-01").toLocalDate());
        bookingDates.setCheckin(Date.valueOf("2018-01-01").toLocalDate());

        boolean validDate = dateCheckValidator.isValid(bookingDates);

        assertThat("Should be invalid if checkin same date as checkout", !validDate);
    }

    @Test
    public void validIfCheckinBeforeCheckout() {
        bookingDates.setCheckin(Date.valueOf("2018-01-01").toLocalDate());
        bookingDates.setCheckout(Date.valueOf("2018-01-05").toLocalDate());

        boolean validDate = dateCheckValidator.isValid(bookingDates);

        assertThat("Should be valid if checkin before checkout", validDate);
    }

}