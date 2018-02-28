import db.InsertSql;
import model.Booking;
import org.junit.Test;

import java.sql.SQLException;
import java.util.GregorianCalendar;

import static org.hamcrest.CoreMatchers.is;
import static org.hamcrest.MatcherAssert.assertThat;

public class CreateBookingTest {

    @Test
    public void testCreatingInsertSql() throws SQLException {
        Booking booking = new Booking.BookingBuilder()
                                    .setHotelid(1)
                                    .setFirstname("Mark")
                                    .setLastname("Winteringham")
                                    .setTotalprice(100)
                                    .setDepositpaid(true)
                                    .setCheckin(new GregorianCalendar(2013,0,31).getTime())
                                    .setCheckout(new GregorianCalendar(2013,0,31).getTime())
                                    .build();

        InsertSql insertSql = new InsertSql(booking);
        String sqlStatement = insertSql.buildSql();
        
        assertThat(sqlStatement, is("INSERT INTO BOOKINGS(hotelid, firstname, lastname, totalprice, depositpaid, checkin, checkout) VALUES(1,'Mark','Winteringham',100,true,'2013-01-31','2013-01-31');"));
    }

}
