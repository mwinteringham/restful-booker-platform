package com.automationintesting.api;

import com.automationintesting.db.RoomDB;
import com.automationintesting.model.db.Room;
import com.automationintesting.model.db.Rooms;
import com.automationintesting.model.service.RoomResult;
import com.automationintesting.service.RoomService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import com.automationintesting.requests.AuthRequests;

import javax.validation.Valid;
import java.sql.SQLException;

@RestController
public class RoomController {

    @Autowired
    private RoomService roomService;

    @RequestMapping(value = "/", method = RequestMethod.GET)
    public ResponseEntity<Rooms> getRooms() throws SQLException {
        Rooms rooms = roomService.getRooms();

        return ResponseEntity.status(HttpStatus.OK).body(rooms);
    }

    @RequestMapping(value = "/{id:[0-9]*}", method = RequestMethod.GET)
    public ResponseEntity getRoom(@PathVariable(value = "id") int roomId) throws SQLException {
        RoomResult roomResult = roomService.getSpecificRoom(roomId);

        return ResponseEntity.status(roomResult.getHttpStatus()).body(roomResult.getRoom());
    }

    @RequestMapping(value = "/", method = RequestMethod.POST)
    public ResponseEntity<Room> createRoom(@Valid @RequestBody Room roomToCreate, @CookieValue(value ="token", required = false) String token) throws SQLException {
        RoomResult roomResult = roomService.createRoom(roomToCreate, token);

        return ResponseEntity.status(roomResult.getHttpStatus()).body(roomResult.getRoom());
    }

    @RequestMapping(value = "/{id:[0-9]*}", method = RequestMethod.DELETE)
    public ResponseEntity deleteRoom(@PathVariable(value = "id") int roomId, @CookieValue(value ="token", required = false) String token) throws SQLException {
        RoomResult roomResult = roomService.deleteRoom(roomId, token);

        return ResponseEntity.status(roomResult.getHttpStatus()).build();
    }

    @RequestMapping(value = "/{id:[0-9]*}", method = RequestMethod.PUT)
    public ResponseEntity<Room> updateRoom(@Valid @RequestBody Room roomToUpdate, @PathVariable(value = "id") int roomId, @CookieValue(value ="token", required = false) String token) throws SQLException {
        RoomResult roomResult = roomService.updateRoom(roomId, roomToUpdate, token);

        return ResponseEntity.status(roomResult.getHttpStatus()).body(roomResult.getRoom());
    }

}
