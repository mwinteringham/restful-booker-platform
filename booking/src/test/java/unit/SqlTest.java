package unit;

import db.BookingDB;
import model.Booking;
import model.CreatedBooking;
import org.junit.Before;
import org.junit.BeforeClass;
import org.junit.Test;

import java.sql.SQLException;
import java.util.GregorianCalendar;
import java.util.List;

import static org.hamcrest.CoreMatchers.is;
import static org.hamcrest.MatcherAssert.assertThat;

public class SqlTest {

    // We need to create a couple of private variables that
    // we will use across multiple tests
    private static BookingDB bookingDB;
    private int currentBookingId;

    // The @BeforeClass annotation means run whatever code is in
    // this method before running any of the tests. Notice how it
    // is set as static. @BeforeClass annotated methods are always
    // static
    @BeforeClass
    public static void createBookingDb() throws SQLException {
        // We first need to instantiate a BookingDB object
        // to use in our tests
        bookingDB = new BookingDB();
    }

    // The @Before annotation means run whatever code is in this
    // method before each test starts to run. This is useful when
    // creating test data
    @Before
    public void resetDb() throws SQLException {
        // We call resetDB to return it back to it's vanilla state
        bookingDB.resetDB();

        // We then create a new Booking using the data builder pattern
        Booking booking = new Booking.BookingBuilder()
                .setRoomid(1)
                .setFirstname("James")
                .setLastname("Dean")
                .setTotalprice(100)
                .setDepositpaid(true)
                .setCheckin(new GregorianCalendar(2018,1,26).getTime())
                .setCheckout(new GregorianCalendar(2018,1,26).getTime())
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
        assertThat(bookingString, is("Booking{roomid=1, firstname='James', lastname='Dean', totalprice=100, depositpaid=true, bookingDates=BookingDates{checkin=2018-02-26, checkout=2018-02-26}}"));
    }

    @Test
    public void testCreateSql() throws SQLException {
        Booking booking = new Booking.BookingBuilder()
                .setRoomid(1)
                .setFirstname("Mark")
                .setLastname("Winteringham")
                .setTotalprice(100)
                .setDepositpaid(true)
                .setCheckin(new GregorianCalendar(2013,0,31).getTime())
                .setCheckout(new GregorianCalendar(2013,0,31).getTime())
                .build();

        CreatedBooking createdBooking = bookingDB.create(booking);
        String createdBookingString = createdBooking.toString();

        assertThat(createdBookingString, is("CreatedBooking{\nbookingid=" + (currentBookingId + 1) + "\n, booking=Booking{roomid=1, firstname='Mark', lastname='Winteringham', totalprice=100, depositpaid=true, bookingDates=BookingDates{checkin=2013-01-31, checkout=2013-01-31}}}"));
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
                .setTotalprice(100)
                .setDepositpaid(true)
                .setCheckin(new GregorianCalendar(2013,0,31).getTime())
                .setCheckout(new GregorianCalendar(2013,0,31).getTime())
                .build();

        CreatedBooking updatedBooking = bookingDB.update(currentBookingId, booking);
        String updatedBookingString = updatedBooking.toString();

        assertThat(updatedBookingString, is("CreatedBooking{\nbookingid=" + currentBookingId + "\n, booking=Booking{roomid=1, firstname='Mark', lastname='Winteringham', totalprice=100, depositpaid=true, bookingDates=BookingDates{checkin=2013-01-31, checkout=2013-01-31}}}"));
    }

    @Test
    public void testQueryByNameSql() throws SQLException {
        List<Booking> booking = bookingDB.queryBookingsByName("James");

        assertThat(booking.toString(), is("[Booking{roomid=1, firstname='James', lastname='Dean', totalprice=100, depositpaid=true, bookingDates=BookingDates{checkin=2018-02-26, checkout=2018-02-26}}]"));
    }
}
