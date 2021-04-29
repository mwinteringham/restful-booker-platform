package com.automationintesting.unit.db;

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

public class DateConflictTest extends BaseTest {

    @BeforeEach
    public void resetDb() throws SQLException, IOException {
        bookingDB.resetDB();
    }

    @Test
    public void testBookingWithNoConflict() throws SQLException {
        LocalDate checkin = LocalDate.of(2100, Month.JANUARY, 1);
        LocalDate checkout = LocalDate.of(2100, Month.JANUARY, 5);

        Booking booking = new Booking.BookingBuilder()
                .setRoomid(1)
                .setFirstname("Mark")
                .setLastname("Winteringham")
                .setDepositpaid(true)
                .setCheckin(checkin)
                .setCheckout(checkout)
                .build();

        Boolean noConflict = bookingDB.checkForBookingConflict(booking);

        assertThat(noConflict, is(false));
    }

    @Test
    public void testConflictingBooking() throws SQLException {
        LocalDate bookingOneCheckin = LocalDate.of(2018, Month.JANUARY, 1);
        LocalDate bookingOneCheckout = LocalDate.of(2018, Month.JANUARY, 5);

        LocalDate bookingTwoCheckin = LocalDate.of(2018, Month.JANUARY, 1);
        LocalDate bookingTwoCheckout = LocalDate.of(2018, Month.JANUARY, 5);

        Booking bookingOne = new Booking.BookingBuilder()
                .setRoomid(1)
                .setFirstname("Mark")
                .setLastname("Winteringham")
                .setDepositpaid(true)
                .setCheckin(bookingOneCheckin)
                .setCheckout(bookingOneCheckout)
                .build();

        CreatedBooking booking = bookingDB.create(bookingOne);

        Booking bookingTwo = new Booking.BookingBuilder()
                .setBookingid(booking.getBookingid() + 1)
                .setRoomid(1)
                .setFirstname("James")
                .setLastname("Dean")
                .setDepositpaid(true)
                .setCheckin(bookingTwoCheckin)
                .setCheckout(bookingTwoCheckout)
                .build();

        Boolean conflict = bookingDB.checkForBookingConflict(bookingTwo);

        assertThat(conflict, is(true));
    }

    @Test
    public void testPartialConflict() throws SQLException {
        LocalDate bookingOneCheckin = LocalDate.of(2018, Month.JANUARY, 1);
        LocalDate bookingOneCheckout = LocalDate.of(2018, Month.JANUARY, 5);

        LocalDate bookingTwoCheckin = LocalDate.of(2018, Month.JANUARY, 3);
        LocalDate bookingTwoCheckout = LocalDate.of(2018, Month.JANUARY, 8);

        Booking bookingOne = new Booking.BookingBuilder()
                .setRoomid(1)
                .setFirstname("Mark")
                .setLastname("Winteringham")
                .setDepositpaid(true)
                .setCheckin(bookingOneCheckin)
                .setCheckout(bookingOneCheckout)
                .build();

        CreatedBooking booking = bookingDB.create(bookingOne);

        Booking bookingTwo = new Booking.BookingBuilder()
                .setBookingid(booking.getBookingid() + 1)
                .setRoomid(1)
                .setFirstname("Mark")
                .setLastname("Winteringham")
                .setDepositpaid(true)
                .setCheckin(bookingTwoCheckin)
                .setCheckout(bookingTwoCheckout)
                .build();

        Boolean conflict = bookingDB.checkForBookingConflict(bookingTwo);

        assertThat(conflict, is(true));
    }

    @Test
    public void testConflictForSpecificRoom() throws SQLException {
        LocalDate bookingOneCheckin = LocalDate.of(2018, Month.JANUARY, 1);
        LocalDate bookingOneCheckout = LocalDate.of(2018, Month.JANUARY, 5);

        LocalDate bookingTwoCheckin = LocalDate.of(2018, Month.JANUARY, 1);
        LocalDate bookingTwoCheckout = LocalDate.of(2018, Month.JANUARY, 5);

        Booking bookingOne = new Booking.BookingBuilder()
                .setRoomid(1)
                .setFirstname("Mark")
                .setLastname("Winteringham")
                .setDepositpaid(true)
                .setCheckin(bookingOneCheckin)
                .setCheckout(bookingOneCheckout)
                .build();

        Booking bookingTwo = new Booking.BookingBuilder()
                .setRoomid(2)
                .setFirstname("Mark")
                .setLastname("Winteringham")
                .setDepositpaid(true)
                .setCheckin(bookingTwoCheckin)
                .setCheckout(bookingTwoCheckout)
                .build();

        bookingDB.create(bookingOne);

        Boolean conflict = bookingDB.checkForBookingConflict(bookingTwo);

        assertThat(conflict, is(false));
    }

    @Test
    public void testNoConflictForOverlapOnCheckoutCheckinDate() throws SQLException {
        LocalDate bookingOneCheckin = LocalDate.of(2018, Month.JANUARY, 1);
        LocalDate bookingOneCheckout = LocalDate.of(2018, Month.JANUARY, 5);

        LocalDate bookingTwoCheckin = LocalDate.of(2018, Month.JANUARY, 5);
        LocalDate bookingTwoCheckout = LocalDate.of(2018, Month.JANUARY, 7);

        Booking bookingOne = new Booking.BookingBuilder()
                .setRoomid(1)
                .setFirstname("Mark")
                .setLastname("Winteringham")
                .setDepositpaid(true)
                .setCheckin(bookingOneCheckin)
                .setCheckout(bookingOneCheckout)
                .build();

        Booking bookingTwo = new Booking.BookingBuilder()
                .setRoomid(1)
                .setFirstname("Mark")
                .setLastname("Winteringham")
                .setDepositpaid(true)
                .setCheckin(bookingTwoCheckin)
                .setCheckout(bookingTwoCheckout)
                .build();

        bookingDB.create(bookingOne);

        Boolean conflict = bookingDB.checkForBookingConflict(bookingTwo);

        assertThat(conflict, is(false));
    }

    @Test
    public void testNoConflictIfReturnedBookingIsSameRoom() throws SQLException {
        int currentBookingCount = bookingDB.queryAllBookings().size();

        LocalDate checkin = LocalDate.of(2100, Month.JANUARY, 1);
        LocalDate checkout = LocalDate.of(2100, Month.JANUARY, 5);

        Booking booking = new Booking.BookingBuilder()
                .setBookingid(currentBookingCount + 1)
                .setRoomid(1)
                .setFirstname("Mark")
                .setLastname("Winteringham")
                .setDepositpaid(true)
                .setCheckin(checkin)
                .setCheckout(checkout)
                .build();

        bookingDB.create(booking);

        Boolean conflict = bookingDB.checkForBookingConflict(booking);

        assertThat(conflict, is(false));
    }

}
