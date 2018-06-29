import db.UpdateSql;
import model.Room;
import org.junit.Test;

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
        Room room = new Room(101, "Twin", 2, false , "Detail, Detail, Detail");

        // We then create a new UpdateSql object and pass it our
        // booking object on instantiation for it to use in future
        // methods
        UpdateSql updateSql = new UpdateSql(1, room);

        // With our UpdateSql object created we can call on it to
        // build our sql and assign it to a string.
        String sqlStatement = updateSql.buildSql();

        // We finally use hamcrest to assertThat the created sql
        // is the same as the expected SQL in the second parameter
        assertThat(sqlStatement, is("UPDATE ROOMS SET room_number='101',type='Twin',beds='2',accessible='false',details='Detail, Detail, Detail' WHERE roomid=1"));
    }

}
