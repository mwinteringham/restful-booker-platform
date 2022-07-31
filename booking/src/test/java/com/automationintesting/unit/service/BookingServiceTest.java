package com.automationintesting.unit.service;

import com.automationintesting.db.BookingDB;
import com.automationintesting.model.db.Booking;
import com.automationintesting.model.db.BookingDates;
import com.automationintesting.model.db.CreatedBooking;
import com.automationintesting.model.service.BookingResult;
import com.automationintesting.requests.AuthRequests;
import com.automationintesting.service.BookingService;
import com.automationintesting.service.DateCheckValidator;
import org.h2.jdbc.JdbcSQLNonTransientException;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.MockitoAnnotations;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;

import java.sql.SQLException;
import java.time.LocalDate;
import java.time.Month;
import java.util.ArrayList;
import java.util.List;
import java.util.Optional;

import static org.junit.jupiter.api.Assertions.assertEquals;
import static org.junit.jupiter.api.Assertions.assertNull;
import static org.mockito.Mockito.when;

public class BookingServiceTest {

    @Mock
    private AuthRequests authRequests;

    @Mock
    private BookingDB bookingDB;

    @Mock
    private DateCheckValidator dateCheckValidator;

    @InjectMocks
    @Autowired
    private BookingService bookingService;

    @BeforeEach
    public void initialiseMocks() {
        MockitoAnnotations.openMocks(this);
    }

    @Test
    public void returnAllBookingsTest() throws SQLException {
        List<Booking> bookings = new ArrayList<Booking>(){{
            this.add(createGenericBooking());
            this.add(createGenericBooking());
        }};

        when(bookingDB.queryAllBookings()).thenReturn(bookings);
        when(authRequests.postCheckAuth("abc123")).thenReturn(true);

        Optional<String> emptyOptional = Optional.empty();

        BookingResult bookingResults = bookingService.getBookings(emptyOptional, "abc123");

        assertEquals(2, bookingResults.getBookings().getBookings().size());
    }

    @Test
    public void returnBookingsByRoomIdTest() throws SQLException {
        List<Booking> bookings = new ArrayList<Booking>(){{
            this.add(createGenericBooking());
        }};

        when(bookingDB.queryBookingsById("2")).thenReturn(bookings);
        when(authRequests.postCheckAuth("abc123")).thenReturn(true);

        Optional<String> roomid = Optional.of("2");

        BookingResult bookingResults = bookingService.getBookings(roomid, "abc123");

        assertEquals(1, bookingResults.getBookings().getBookings().size());
    }

    @Test
    public void returnSpecificBookingTest() throws SQLException {
        Booking booking = this.createGenericBooking();
        when(bookingDB.query(2)).thenReturn(booking);
        when(authRequests.postCheckAuth("abc123")).thenReturn(true);

        BookingResult bookingResult = bookingService.getIndividualBooking(2,"abc123");

        assertEquals(HttpStatus.OK, bookingResult.getStatus());
        assertEquals("Booking{roomid=2, firstname='Mark', lastname='Dean', depositpaid=true, bookingDates=BookingDates{checkin=2019-09-01, checkout=2019-09-02}}", bookingResult.getBooking().toString());
    }


    @Test
    public void returnBookingNotFoundTest() throws SQLException {
        when(bookingDB.query(100)).thenThrow(new JdbcSQLNonTransientException("a", "b", "c", 1, new Throwable(), "d"));
        when(authRequests.postCheckAuth("abc123")).thenReturn(true);

        BookingResult bookingResult = bookingService.getIndividualBooking(100, "abc123");

        assertEquals(HttpStatus.NOT_FOUND, bookingResult.getStatus());
        assertNull(bookingResult.getBooking());
    }

    @Test
    public void deleteBookingTest() throws SQLException {
        when(authRequests.postCheckAuth("abc123")).thenReturn(true);
        when(bookingDB.delete(1)).thenReturn(true);

        HttpStatus bookingResult = bookingService.deleteBooking(1, "abc123");

        assertEquals(HttpStatus.ACCEPTED, bookingResult);
    }

    @Test
    public void deleteBookingNotFoundTest() throws SQLException {
        when(authRequests.postCheckAuth("abc123")).thenReturn(true);
        when(bookingDB.delete(100)).thenReturn(false);

        HttpStatus bookingResult = bookingService.deleteBooking(100, "abc123");

        assertEquals(HttpStatus.NOT_FOUND, bookingResult);
    }

    @Test
    public void updateBookingTest() throws SQLException {
        Booking booking = createGenericBooking();
        CreatedBooking createdBooking = new CreatedBooking(1, booking);

        when(authRequests.postCheckAuth("abc123")).thenReturn(true);
        when(dateCheckValidator.isValid(booking.getBookingDates())).thenReturn(true);
        when(bookingDB.checkForBookingConflict(booking)).thenReturn(false);
        when(bookingDB.update(1, booking)).thenReturn(createdBooking);

        BookingResult bookingResult = bookingService.updateBooking(1, booking, "abc123");

        assertEquals(HttpStatus.OK, bookingResult.getStatus());
        assertEquals("CreatedBooking{bookingid=1, booking=Booking{roomid=2, firstname='Mark', lastname='Dean', depositpaid=true, bookingDates=BookingDates{checkin=2019-09-01, checkout=2019-09-02}}}", bookingResult.getCreatedBooking().toString());
    }

    @Test
    public void updateBookingNotFoundTest() throws SQLException {
        Booking booking = createGenericBooking();

        when(authRequests.postCheckAuth("abc123")).thenReturn(true);
        when(dateCheckValidator.isValid(booking.getBookingDates())).thenReturn(true);
        when(bookingDB.checkForBookingConflict(booking)).thenReturn(false);
        when(bookingDB.update(100, booking)).thenReturn(null);

        BookingResult bookingResult = bookingService.updateBooking(100, booking, "abc123");

        assertEquals(HttpStatus.NOT_FOUND, bookingResult.getStatus());
        assertNull(bookingResult.getCreatedBooking());
    }

    @Test
    public void updateBookingDatesTest() throws SQLException {
        Booking booking = createGenericBooking();

        when(authRequests.postCheckAuth("abc123")).thenReturn(true);
        when(dateCheckValidator.isValid(booking.getBookingDates())).thenReturn(true);
        when(bookingDB.checkForBookingConflict(booking)).thenReturn(true);

        BookingResult bookingResult = bookingService.updateBooking(100, booking, "abc123");
        assertEquals(HttpStatus.CONFLICT, bookingResult.getStatus());
    }

    @Test
    public void updateBookingBadDatesTest() throws SQLException {
        Booking booking = createGenericBooking();

        when(authRequests.postCheckAuth("abc123")).thenReturn(true);
        when(dateCheckValidator.isValid(booking.getBookingDates())).thenReturn(false);

        BookingResult bookingResult = bookingService.updateBooking(100, booking, "abc123");
        assertEquals(HttpStatus.CONFLICT, bookingResult.getStatus());
    }

    @Test
    public void createBookingTest() throws SQLException {
        Booking booking = createGenericBooking();
        when(bookingDB.create(booking)).thenReturn(new CreatedBooking(3, booking));
        when(dateCheckValidator.isValid(booking.getBookingDates())).thenReturn(true);

        BookingResult bookingResult = bookingService.createBooking(booking);

        assertEquals(HttpStatus.CREATED, bookingResult.getStatus());
        assertEquals("CreatedBooking{bookingid=3, booking=Booking{roomid=2, firstname='Mark', lastname='Dean', depositpaid=true, bookingDates=BookingDates{checkin=2019-09-01, checkout=2019-09-02}}}", bookingResult.getCreatedBooking().toString());
    }

    @Test
    public void createBookingDateConflictTest() throws SQLException {
        Booking booking = createGenericBooking();
        when(bookingDB.checkForBookingConflict(booking)).thenReturn(true);
        when(dateCheckValidator.isValid(booking.getBookingDates())).thenReturn(true);

        BookingResult bookingResult = bookingService.createBooking(booking);

        assertEquals(HttpStatus.CONFLICT, bookingResult.getStatus());
    }

    @Test
    public void createBookingDateInvalidTest() throws SQLException {
        Booking booking = createGenericBooking();
        when(dateCheckValidator.isValid(booking.getBookingDates())).thenReturn(false);

        BookingResult bookingResult = bookingService.createBooking(booking);

        assertEquals(HttpStatus.CONFLICT, bookingResult.getStatus());
    }

    private Booking createGenericBooking() {
        LocalDate startDate = LocalDate.of(2019, Month.SEPTEMBER, 1);
        LocalDate endDate = LocalDate.of(2019, Month.SEPTEMBER, 2);

        BookingDates bookingDates = new BookingDates(startDate, endDate);
        return new Booking(1, 2, "Mark", "Dean", true, bookingDates);
    }

}
