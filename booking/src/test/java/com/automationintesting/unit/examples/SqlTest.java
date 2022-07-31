package com.automationintesting.unit.examples;

import com.automationintesting.model.db.Booking;
import com.automationintesting.model.db.CreatedBooking;
import com.automationintesting.unit.BaseTest;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;

import java.io.IOException;
import java.sql.SQLException;
import java.time.LocalDate;
import java.time.Month;

import static org.hamcrest.CoreMatchers.is;
import static org.hamcrest.MatcherAssert.assertThat;

// This test class extends the class BaseTest meaning we can inherit
// an instance of BookingDB to use in this class
public class SqlTest extends BaseTest {

    // We need to create a couple of private variables that
    // we will use across multiple tests
    private int currentBookingId;

    // The @Before annotation means run whatever code is in this
    // method before each test starts to run. This is useful when
    // creating test data
    @BeforeEach
    public void resetDb() throws SQLException, IOException {
        // We call resetDB to return it back to it's vanilla state
        bookingDB.resetDB();

        // We then create a new Booking using the data builder pattern
        Booking booking = new Booking.BookingBuilder()
                .setRoomid(1)
                .setFirstname("James")
                .setLastname("Dean")
                .setDepositpaid(true)
                .setCheckin(LocalDate.of(2018, Month.FEBRUARY, 26))
                .setCheckout(LocalDate.of(2018, Month.FEBRUARY, 26))
                .build();

        // With the booking created we can send it to the BookingDb to be created
        CreatedBooking createdBooking = bookingDB.create(booking);

        // Finally we need the current booking ID to use in our tests
        // so we save it currentBookingId
        currentBookingId = createdBooking.getBookingid();
    }

    // We add the @Test annotation so that when JUnit runs it knows which
    // methods to run as tests
    @Test
    // We give the check a clear name to ensure that it is descriptive in
    // what it is checking
    public void testQuerySql() throws SQLException {
        // We first need to call the bookingDB with a currentBookingId
        // to get a booking from the DB that matches the ID
        Booking booking = bookingDB.query(currentBookingId);

        // We then convert the booking into a string to easily assert against
        String bookingString = booking.toString();

        // We finally use hamcrest to assertThat the booking we queried
        // is the same as the expected String in the second parameter
        assertThat(bookingString, is("Booking{roomid=1, firstname='James', lastname='Dean', depositpaid=true, bookingDates=BookingDates{checkin=2018-02-26, checkout=2018-02-26}}"));
    }

    @Test
    public void testCreateSql() throws SQLException {
        Booking booking = new Booking.BookingBuilder()
                .setRoomid(1)
                .setFirstname("Mark")
                .setLastname("Winteringham")
                .setDepositpaid(true)
                .setCheckin(LocalDate.of(2013, Month.JANUARY, 31))
                .setCheckout(LocalDate.of(2013, Month.JANUARY, 31))
                .build();

        CreatedBooking createdBooking = bookingDB.create(booking);
        String createdBookingString = createdBooking.toString();

        assertThat(createdBookingString, is("CreatedBooking{bookingid=" + (currentBookingId + 1) + ", booking=Booking{roomid=1, firstname='Mark', lastname='Winteringham', depositpaid=true, bookingDates=BookingDates{checkin=2013-01-31, checkout=2013-01-31}}}"));
    }

    @Test
    public void testDeleteSql() throws SQLException {
        boolean result = bookingDB.delete(currentBookingId);

        assertThat(result, is(true));
    }


    @Test
    public void testUpdateSql() throws SQLException {
        Booking booking = new Booking.BookingBuilder()
                .setRoomid(1)
                .setFirstname("Mark")
                .setLastname("Winteringham")
                .setDepositpaid(true)
                .setCheckin(LocalDate.of(2013, Month.JANUARY, 31))
                .setCheckout(LocalDate.of(2013, Month.JANUARY, 31))
                .build();

        CreatedBooking updatedBooking = bookingDB.update(currentBookingId, booking);
        String updatedBookingString = updatedBooking.toString();

        assertThat(updatedBookingString, is("CreatedBooking{bookingid=" + currentBookingId + ", booking=Booking{roomid=1, firstname='Mark', lastname='Winteringham', depositpaid=true, bookingDates=BookingDates{checkin=2013-01-31, checkout=2013-01-31}}}"));
    }

}
