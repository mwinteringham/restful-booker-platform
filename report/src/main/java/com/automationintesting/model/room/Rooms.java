package com.automationintesting.model.room;

import com.fasterxml.jackson.annotation.JsonProperty;

import java.util.List;

public class Rooms {

    @JsonProperty(value = "rooms")
    private List<Room> roomList;

    public Rooms(List<Room> roomList) {
        this.roomList = roomList;
    }

    public Rooms() {
    }

    public List<Room> getRooms() {
        return roomList;
    }

    public void setRooms(List<Room> rooms) {
        this.roomList = rooms;
    }

    @Override
    public String toString() {
        return "RoomSearchResults{" +
                "rooms=" + roomList.toString() +
                '}';
    }
}
