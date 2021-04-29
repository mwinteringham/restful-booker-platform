package com.automationintesting.unit.examples;

import com.automationintesting.model.db.Room;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;

import java.io.IOException;
import java.sql.SQLException;
import java.util.List;

import static org.hamcrest.CoreMatchers.*;
import static org.hamcrest.MatcherAssert.assertThat;
import static org.junit.jupiter.api.Assertions.assertEquals;

public class SqlTest extends BaseTest {

    // We need to create a couple of private variables that
    // we will use across multiple tests
    private int currentRoomId;

    // The @Before annotation means run whatever code is in this
    // method before each test starts to run. This is useful when
    // creating test data
    @BeforeEach
    public void resetDB() throws SQLException, IOException {
        // We call resetDB to return it back to it's vanilla state
        roomDB.seedDB();

        // We then create a Room object to send to the roomDB
        Room room = new Room(101,
                "Twin",
                false,
                "https://www.mwtestconsultancy.co.uk/img/room1.jpg",
                "Aenean porttitor mauris sit amet lacinia molestie",
                new String[]{"Wifi", "TV", "Safe"},
                100);

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

        // We finally use Junit's assertEquals to check the room we queried
        // is the same as the expected String in the second parameter
        assertEquals(queriedRoomString, "Room{roomid=" + currentRoomId + ", roomNumber=101, type='Twin', accessible=false, image='https://www.mwtestconsultancy.co.uk/img/room1.jpg', description='Aenean porttitor mauris sit amet lacinia molestie', features=[Wifi, TV, Safe], roomPrice=100}");
    }

    @Test
    public void testDeleteRoom() throws SQLException {
        boolean isDeleted = roomDB.delete(currentRoomId);

        assertThat(isDeleted, is(true));
    }

    @Test
    public void testQueryRooms() throws SQLException {
        List<Room> queriedRoom = roomDB.queryRooms();

        Room room = queriedRoom.get(0);

        assertThat(room, instanceOf(Room.class));
    }

    @Test
    public void testCreateRoom() throws SQLException {
        Room room = new Room(102,
                "Twin",
                false,
                "https://www.mwtestconsultancy.co.uk/img/room1.jpg",
                "In posuere accumsan aliquet.",
                new String[]{"Wifi, TV, Mini-bar"},
                100);

        Room createdRoom = roomDB.create(room);

        String createdRoomString = createdRoom.toString();

        assertEquals(createdRoomString, "Room{roomid=" + (currentRoomId + 1) + ", roomNumber=102, type='Twin', accessible=false, image='https://www.mwtestconsultancy.co.uk/img/room1.jpg', description='In posuere accumsan aliquet.', features=[Wifi, TV, Mini-bar], roomPrice=100}");
    }

    @Test
    public void testUpdateRoom() throws SQLException {
        Room room = new Room(103,
                "Twin",
                false,
                "https://www.mwtestconsultancy.co.uk/img/room1.jpg",
                "Maecenas sit amet nisl massa. Interdum et malesuada fames ac ante.",
                new String[]{"Wifi, TV, Mini-bar"},
                100);

        Room updatedRoom = roomDB.update(currentRoomId, room);

        String updatedRoomString = updatedRoom.toString();

        assertEquals(updatedRoomString, "Room{roomid=" + currentRoomId + ", roomNumber=103, type='Twin', accessible=false, image='https://www.mwtestconsultancy.co.uk/img/room1.jpg', description='Maecenas sit amet nisl massa. Interdum et malesuada fames ac ante.', features=[Wifi, TV, Mini-bar], roomPrice=100}");
    }


}
