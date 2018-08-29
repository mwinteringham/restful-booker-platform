import db.RoomDB;
import db.UpdateSql;
import model.Room;
import org.junit.Before;
import org.junit.BeforeClass;
import org.junit.Test;

import java.sql.SQLException;
import java.util.List;

import static org.hamcrest.CoreMatchers.is;
import static org.hamcrest.MatcherAssert.assertThat;

public class SqlTest {

    // We need to create a couple of private variables that
    // we will use across multiple tests
    private static RoomDB roomDB;
    private int currentRoomId;

    // The @BeforeClass annotation means run whatever code is in
    // this method before running any of the tests. Notice how it
    // is set as static. @BeforeClass annotated methods are always
    // static
    @BeforeClass
    public static void createRoomBD() throws SQLException {
        roomDB = new RoomDB();
    }

    // The @Before annotation means run whatever code is in this
    // method before each test starts to run. This is useful when
    // creating test data
    @Before
    public void resetDB() throws SQLException {
        // We call resetDB to return it back to it's vanilla state
        roomDB.resetDB();

        // We then create a Room object to send to the roomDB
        Room room = new Room(101, "Twin", 2, false , "Detail, Detail, Detail");

        // With the room created we can send it to the RoomDB to be created
        Room createdRoom = roomDB.create(room);

        // Finally we need the current room ID to use in our tests
        // so we save it currentRoomId
        currentRoomId = createdRoom.getRoomid();
    }

    // We add the @Test annotation so that when JUnit runs it knows which
    // methods to run as tests
    @Test
    // We give the check a clear name to ensure that it is descriptive in
    // what it is checking
    public void testQueryRoom() throws SQLException {
        // We first need to call the roomDB with a currentRoomId
        // to get a room from the DB that matches the ID
        Room queriedRoom = roomDB.query(currentRoomId);

        // We then convert the room into a string to easily assert against
        String queriedRoomString = queriedRoom.toString();

        // We finally use hamcrest to assertThat the room we queried
        // is the same as the expected String in the second parameter
        assertThat(queriedRoomString, is("Room{roomid=" + currentRoomId + ", roomNumber=101, type='Twin', beds=2, accessible=false, details='Detail, Detail, Detail', bookings=null}"));
    }

    @Test
    public void testDeleteRoom() throws SQLException {
        boolean isDeleted = roomDB.delete(currentRoomId);

        assertThat(isDeleted, is(true));
    }

    @Test
    public void testQueryRooms() throws SQLException {
        List<Room> queriedRoom = roomDB.queryRooms();

        String queriedRoomString = queriedRoom.toString();

        assertThat(queriedRoomString, is("[Room{roomid=" + currentRoomId + ", roomNumber=101, type='Twin', beds=2, accessible=false, details='Detail, Detail, Detail', bookings=null}]"));
    }

    @Test
    public void testCreateRoom() throws SQLException {
        Room room = new Room(102, "Single", 1, true , "Cake");

        Room createdRoom = roomDB.create(room);

        String createdRoomString = createdRoom.toString();

        assertThat(createdRoomString, is("Room{roomid=" + (currentRoomId + 1) + ", roomNumber=102, type='Single', beds=1, accessible=true, details='Cake', bookings=null}"));
    }

    @Test
    public void testUpdateRoom() throws SQLException {
        Room room = new Room(103, "Single", 1, true , "Cake");

        Room updatedRoom = roomDB.update(currentRoomId, room);

        String updatedRoomString = updatedRoom.toString();

        assertThat(updatedRoomString, is("Room{roomid=" + currentRoomId + ", roomNumber=103, type='Single', beds=1, accessible=true, details='Cake', bookings=null}"));
    }


}
