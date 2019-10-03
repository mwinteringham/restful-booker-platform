package com.automationintesting.model.service;

import com.automationintesting.model.db.Room;
import org.springframework.http.HttpStatus;

public class RoomResult {

    private HttpStatus httpStatus;

    private Room room;

    public RoomResult(HttpStatus httpStatus, Room room) {
        this.httpStatus = httpStatus;
        this.room = room;
    }

    public RoomResult(HttpStatus httpStatus) {
        this.httpStatus = httpStatus;
    }

    public HttpStatus getHttpStatus() {
        return httpStatus;
    }

    public Room getRoom() {
        return room;
    }
}
