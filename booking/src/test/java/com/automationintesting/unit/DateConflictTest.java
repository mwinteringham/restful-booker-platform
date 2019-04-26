package com.automationintesting.unit;

import com.automationintesting.model.Booking;
import org.junit.Test;

import java.sql.SQLException;
import java.text.ParseException;
import java.text.SimpleDateFormat;
import java.util.Date;

import static org.hamcrest.CoreMatchers.is;
import static org.hamcrest.MatcherAssert.assertThat;

public class DateConflictTest extends BaseTest {

    @Test
    public void testBookingWithNoConflict() throws SQLException, ParseException {
        SimpleDateFormat simpleDateFormat = new SimpleDateFormat("yyyy-MM-dd");
        Date checkin = simpleDateFormat.parse("2100-01-01");
        Date checkout = simpleDateFormat.parse("2100-01-05");

        Booking booking = new Booking.BookingBuilder()
                .setRoomid(1)
                .setFirstname("Mark")
                .setLastname("Winteringham")
                .setDepositpaid(true)
                .setTotalprice(100)
                .setCheckin(checkin)
                .setCheckout(checkout)
                .build();

        Boolean noConflict = bookingDB.checkForBookingConflict(booking);

        assertThat(noConflict, is(false));
    }

    @Test
    public void testConflictingBooking() throws SQLException, ParseException {
        SimpleDateFormat simpleDateFormat = new SimpleDateFormat("yyyy-MM-dd");
        Date bookingOneCheckin = simpleDateFormat.parse("2018-01-01");
        Date bookingOneCheckout = simpleDateFormat.parse("2018-01-05");

        Date bookingTwoCheckin = simpleDateFormat.parse("2018-01-01");
        Date bookingTwoCheckout = simpleDateFormat.parse("2018-01-05");

        Booking bookingOne = new Booking.BookingBuilder()
                .setRoomid(1)
                .setFirstname("Mark")
                .setLastname("Winteringham")
                .setDepositpaid(true)
                .setTotalprice(100)
                .setCheckin(bookingOneCheckin)
                .setCheckout(bookingOneCheckout)
                .build();

        Booking bookingTwo = new Booking.BookingBuilder()
                .setRoomid(1)
                .setFirstname("Mark")
                .setLastname("Winteringham")
                .setDepositpaid(true)
                .setTotalprice(100)
                .setCheckin(bookingTwoCheckin)
                .setCheckout(bookingTwoCheckout)
                .build();

        bookingDB.create(bookingOne);

        Boolean conflict = bookingDB.checkForBookingConflict(bookingTwo);

        assertThat(conflict, is(true));
    }

    @Test
    public void testPartialConflict() throws ParseException, SQLException {
        SimpleDateFormat simpleDateFormat = new SimpleDateFormat("yyyy-MM-dd");
        Date bookingOneCheckin = simpleDateFormat.parse("2018-01-01");
        Date bookingOneCheckout = simpleDateFormat.parse("2018-01-05");

        Date bookingTwoCheckin = simpleDateFormat.parse("2018-01-03");
        Date bookingTwoCheckout = simpleDateFormat.parse("2018-01-08");

        Booking bookingOne = new Booking.BookingBuilder()
                .setRoomid(1)
                .setFirstname("Mark")
                .setLastname("Winteringham")
                .setDepositpaid(true)
                .setTotalprice(100)
                .setCheckin(bookingOneCheckin)
                .setCheckout(bookingOneCheckout)
                .build();

        Booking bookingTwo = new Booking.BookingBuilder()
                .setRoomid(1)
                .setFirstname("Mark")
                .setLastname("Winteringham")
                .setDepositpaid(true)
                .setTotalprice(100)
                .setCheckin(bookingTwoCheckin)
                .setCheckout(bookingTwoCheckout)
                .build();

        bookingDB.create(bookingOne);

        Boolean conflict = bookingDB.checkForBookingConflict(bookingTwo);

        assertThat(conflict, is(true));
    }

    @Test
    public void testConflictForSpecificRoom() throws SQLException, ParseException {
        SimpleDateFormat simpleDateFormat = new SimpleDateFormat("yyyy-MM-dd");
        Date bookingOneCheckin = simpleDateFormat.parse("2018-01-01");
        Date bookingOneCheckout = simpleDateFormat.parse("2018-01-05");

        Date bookingTwoCheckin = simpleDateFormat.parse("2018-01-01");
        Date bookingTwoCheckout = simpleDateFormat.parse("2018-01-05");

        Booking bookingOne = new Booking.BookingBuilder()
                .setRoomid(1)
                .setFirstname("Mark")
                .setLastname("Winteringham")
                .setDepositpaid(true)
                .setTotalprice(100)
                .setCheckin(bookingOneCheckin)
                .setCheckout(bookingOneCheckout)
                .build();

        Booking bookingTwo = new Booking.BookingBuilder()
                .setRoomid(2)
                .setFirstname("Mark")
                .setLastname("Winteringham")
                .setDepositpaid(true)
                .setTotalprice(100)
                .setCheckin(bookingTwoCheckin)
                .setCheckout(bookingTwoCheckout)
                .build();

        bookingDB.create(bookingOne);

        Boolean conflict = bookingDB.checkForBookingConflict(bookingTwo);

        assertThat(conflict, is(false));
    }

}
