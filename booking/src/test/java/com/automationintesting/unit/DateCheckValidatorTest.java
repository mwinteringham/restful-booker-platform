package com.automationintesting.unit;

import model.BookingDates;
import org.junit.Before;
import org.junit.Test;

import java.sql.Date;

import static org.hamcrest.MatcherAssert.assertThat;

public class DateCheckValidatorTest {

    private validators.DateCheckValidator dateCheckValidator;
    private BookingDates bookingDates;

    @Before
    public void setup() {
        dateCheckValidator = new validators.DateCheckValidator();
        bookingDates = new BookingDates();
    }

    @Test
    public void invalidIfDatesNotProvided() {
        boolean validDate = dateCheckValidator.isValid(bookingDates);

        assertThat("Should be invalid if dates not provided", !validDate);
    }

    @Test
    public void invalidIfCheckinAfterCheckout() {
        bookingDates.setCheckout(Date.valueOf("2018-01-01"));
        bookingDates.setCheckin(Date.valueOf("2018-01-05"));

        boolean validDate = dateCheckValidator.isValid(bookingDates);

        assertThat("Should be invalid if checkin after checkout", !validDate);
    }

    @Test
    public void invalidIfCheckinAndCheckoutSameDay() {
        bookingDates.setCheckout(Date.valueOf("2018-01-01"));
        bookingDates.setCheckin(Date.valueOf("2018-01-01"));

        boolean validDate = dateCheckValidator.isValid(bookingDates);

        assertThat("Should be invalid if checkin same date as checkout", !validDate);
    }

    @Test
    public void validIfCheckinBeforeCheckout() {
        bookingDates.setCheckin(Date.valueOf("2018-01-01"));
        bookingDates.setCheckout(Date.valueOf("2018-01-05"));

        boolean validDate = dateCheckValidator.isValid(bookingDates);

        assertThat("Should be valid if checkin before checkout", validDate);
    }

}