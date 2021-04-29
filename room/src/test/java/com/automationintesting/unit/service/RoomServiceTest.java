package com.automationintesting.unit.service;

import com.automationintesting.db.RoomDB;
import com.automationintesting.model.db.Room;
import com.automationintesting.model.db.Rooms;
import com.automationintesting.model.service.RoomResult;
import com.automationintesting.requests.AuthRequests;
import com.automationintesting.service.RoomService;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.MockitoAnnotations;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;

import java.sql.SQLException;
import java.util.ArrayList;
import java.util.List;

import static org.junit.jupiter.api.Assertions.assertEquals;
import static org.mockito.Mockito.when;

public class RoomServiceTest {

    @Mock
    private RoomDB roomDB;

    @Mock
    private AuthRequests authRequests;

    @Autowired
    @InjectMocks
    private RoomService roomService;

    @BeforeEach
    public void initialiseMocks() {
        MockitoAnnotations.openMocks(this);
    }

    @Test
    public void getRoomsTest() throws SQLException {
        List<Room> sampleRooms = new ArrayList<>(){{
            this.add(new Room(101, "Single", true, "image1", "Room description", new String[] {"a", "b", "c"}, 123));
            this.add(new Room(102, "Twin", false, "image2", "Room description 2", new String[] {"x", "y", "z"}, 987));
        }};

        when(roomDB.queryRooms()).thenReturn(sampleRooms);

        Rooms rooms = roomService.getRooms();

        assertEquals(rooms.toString(), "Rooms{rooms=[Room{roomid=0, roomNumber=101, type='Single', accessible=true, image='image1', description='Room description', features=[a, b, c], roomPrice=123}, Room{roomid=0, roomNumber=102, type='Twin', accessible=false, image='image2', description='Room description 2', features=[x, y, z], roomPrice=987}]}");
    }

    @Test
    public void getSpecificRoomTest() throws SQLException {
        Room sampleRoom = new Room(101, "Single", true, "image1", "Room description", new String[] {"a", "b", "c"}, 123);

        when(roomDB.query(1)).thenReturn(sampleRoom);

        RoomResult room = roomService.getSpecificRoom(1);

        assertEquals(room.getHttpStatus(), HttpStatus.OK);
        assertEquals(room.getRoom().toString(),"Room{roomid=0, roomNumber=101, type='Single', accessible=true, image='image1', description='Room description', features=[a, b, c], roomPrice=123}");
    }

    @Test
    public void getSpecificRoomNotFoundTest() throws SQLException {
        when(roomDB.query(1)).thenReturn(null);

        RoomResult roomResult = roomService.getSpecificRoom(1);

        assertEquals(roomResult.getHttpStatus(), HttpStatus.NOT_FOUND);
    }

    @Test
    public void createRoomTest() throws SQLException {
        Room sampleRoom = new Room(103, "Single", true, "image1", "Room description", new String[] {"a", "b", "c"}, 123);

        when(authRequests.postCheckAuth("abc")).thenReturn(true);
        when(roomDB.create(sampleRoom)).thenReturn(sampleRoom);

        RoomResult roomResult = roomService.createRoom(sampleRoom, "abc");

        assertEquals(roomResult.getHttpStatus(), HttpStatus.CREATED);
        assertEquals(roomResult.getRoom().toString(),"Room{roomid=0, roomNumber=103, type='Single', accessible=true, image='image1', description='Room description', features=[a, b, c], roomPrice=123}");
    }

    @Test
    public void createRoomNotAuthorisedTest() throws SQLException {
        Room sampleRoom = new Room(103, "Single", true, "image1", "Room description", new String[] {"a", "b", "c"}, 123);

        when(authRequests.postCheckAuth("abc")).thenReturn(false);

        RoomResult roomResult = roomService.createRoom(sampleRoom, "abc");

        assertEquals(roomResult.getHttpStatus(), HttpStatus.FORBIDDEN);
    }

    @Test
    public void deleteRoomTest() throws SQLException {
        when(authRequests.postCheckAuth("abc")).thenReturn(true);
        when(roomDB.delete(1)).thenReturn(true);

        RoomResult roomResult = roomService.deleteRoom(1, "abc");

        assertEquals(roomResult.getHttpStatus(), HttpStatus.ACCEPTED);
    }

    @Test
    public void deleteRoomNotFoundTest() throws SQLException {
        when(authRequests.postCheckAuth("abc")).thenReturn(true);
        when(roomDB.delete(1)).thenReturn(false);

        RoomResult roomResult = roomService.deleteRoom(1, "abc");

        assertEquals(roomResult.getHttpStatus(), HttpStatus.NOT_FOUND);
    }

    @Test
    public void deleteRoomNotAuthenticatedTest() throws SQLException {
        when(authRequests.postCheckAuth("abc")).thenReturn(false);

        RoomResult roomResult = roomService.deleteRoom(1, "abc");

        assertEquals(roomResult.getHttpStatus(), HttpStatus.FORBIDDEN);
    }

    @Test
    public void updateRoomTest() throws SQLException {
        Room sampleRoom = new Room(105, "Twin", true, "image1", "Room description", new String[] {"a", "b", "c"}, 123);

        when(authRequests.postCheckAuth("abc")).thenReturn(true);
        when(roomDB.update(1, sampleRoom)).thenReturn(sampleRoom);

        RoomResult roomResult = roomService.updateRoom(1, sampleRoom, "abc");

        assertEquals(roomResult.getHttpStatus(), HttpStatus.ACCEPTED);
        assertEquals(roomResult.getRoom().toString(), "Room{roomid=0, roomNumber=105, type='Twin', accessible=true, image='image1', description='Room description', features=[a, b, c], roomPrice=123}");
    }

    @Test
    public void updateRoomNotFoundTest() throws SQLException {
        Room sampleRoom = new Room(105, "Twin", true, "image1", "Room description", new String[] {"a", "b", "c"}, 123);

        when(authRequests.postCheckAuth("abc")).thenReturn(true);
        when(roomDB.update(1, sampleRoom)).thenReturn(null);

        RoomResult roomResult = roomService.updateRoom(1, sampleRoom, "abc");

        assertEquals(roomResult.getHttpStatus(), HttpStatus.NOT_FOUND);
    }

    @Test
    public void updateRoomNotAuthorisedTest() throws SQLException {
        Room sampleRoom = new Room(105, "Twin", true, "image1", "Room description", new String[] {"a", "b", "c"}, 123);

        when(authRequests.postCheckAuth("abc")).thenReturn(false);

        RoomResult roomResult = roomService.updateRoom(1, sampleRoom, "abc");

        assertEquals(roomResult.getHttpStatus(), HttpStatus.FORBIDDEN);
    }

}
