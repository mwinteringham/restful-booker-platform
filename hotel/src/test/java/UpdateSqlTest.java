import db.UpdateSql;
import model.Contact;
import model.Hotel;
import org.junit.Test;

import java.util.GregorianCalendar;

import static org.hamcrest.CoreMatchers.is;
import static org.hamcrest.MatcherAssert.assertThat;

public class UpdateSqlTest {

    // We add the @Test annotation so that when JUnit runs it knows which
    // methods to run as tests
    @Test
    // We give the check a clear name to ensure that it is descriptive in
    // what it is checking
    public void testCreatingUpdateSql(){
        // We need to create our object that will be used to create our sql. We start
        // by creating a Contact object so that we can then add that to hotel object
        Contact hotelContact = new Contact("Mark Winteringham", "01546 213756", "mark@test.com");
        Hotel hotel = new Hotel("Hilton", "10 The street, Brighton", new GregorianCalendar(2018,01,01).getTime(), hotelContact);

        // We then create a new UpdateSql object and pass it our
        // booking object on instantiation for it to use in future
        // methods
        UpdateSql updateSql = new UpdateSql(1, hotel);

        // With our UpdateSql object created we can call on it to
        // build our sql and assign it to a string.
        String sqlStatement = updateSql.buildSql();

        // We finally use hamcrest to assertThat the created sql
        // is the same as the expected SQL in the second parameter
        assertThat(sqlStatement, is("UPDATE HOTELS SET name='Hilton',address='10 The street, Brighton',regdate='2018-02-01',contactName='Mark Winteringham',contactPhone='01546 213756',contactEmail='mark@test.com' WHERE hotelid=1"));
    }

}
