import db.BookingDB;
import model.Booking;
import model.CreatedBooking;
import org.junit.Test;

import java.sql.SQLException;
import java.util.GregorianCalendar;

import static org.hamcrest.CoreMatchers.is;
import static org.hamcrest.MatcherAssert.assertThat;

public class CreateBookingTest {

    @Test
    public void testCreateBooking() throws SQLException {
        Booking booking = new Booking.BookingBuilder()
                                    .setHotelid(1)
                                    .setFirstname("Mark")
                                    .setLastname("Winteringham")
                                    .setTotalprice(100)
                                    .setDepositpaid(true)
                                    .setCheckin(new GregorianCalendar(2013,0,31).getTime())
                                    .setCheckout(new GregorianCalendar(2013,0,31).getTime())
                                    .build();

        BookingDB bookingDB = new BookingDB();
        CreatedBooking createdBooking = bookingDB.create(booking);

        assertThat(createdBooking.getBooking().toString(), is("Booking{hotelid=1, firstname='Mark', lastname='Winteringham', totalprice=100, depositpaid=true, bookingDates=BookingDates{checkin=2013-01-31, checkout=2013-01-31}}"));
    }

}
