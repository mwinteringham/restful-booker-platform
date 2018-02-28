import db.InsertSql;
import model.Booking;
import org.junit.Test;

import java.sql.SQLException;
import java.util.GregorianCalendar;

import static org.hamcrest.CoreMatchers.is;
import static org.hamcrest.MatcherAssert.assertThat;

public class InsertSqlTest {

    // We add the @Test annotation so that when JUnit runs it knows which
    // methods to run as tests
    @Test
    // We give the check a clear name to ensure that it is descriptive in
    // what it is checking
    public void testCreatingInsertSql() {
        // We first need to create a booking object to use later
        // we can use the bookings builder pattern to create it
        Booking booking = new Booking.BookingBuilder()
                                    .setHotelid(1)
                                    .setFirstname("Mark")
                                    .setLastname("Winteringham")
                                    .setTotalprice(100)
                                    .setDepositpaid(true)
                                    .setCheckin(new GregorianCalendar(2013,0,31).getTime())
                                    .setCheckout(new GregorianCalendar(2013,0,31).getTime())
                                    .build();

        // We then create a new InsertSql object and pass it our
        // booking object on instantiation for it to use in future
        // methods
        InsertSql insertSql = new InsertSql(booking);

        // With our InsertSql object created we can call on it to
        // build our sql and assign it to a string.
        String sqlStatement = insertSql.buildSql();

        // We finally use hamcrest to assertThat the created sql
        // is the same as the expected SQL in the second parameter
        assertThat(sqlStatement, is("INSERT INTO BOOKINGS(hotelid, firstname, lastname, totalprice, depositpaid, checkin, checkout) VALUES(1,'Mark','Winteringham',100,true,'2013-01-31','2013-01-31');"));
    }

}
