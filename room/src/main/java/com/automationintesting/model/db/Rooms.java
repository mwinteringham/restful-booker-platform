package com.automationintesting.model.db;

import com.fasterxml.jackson.annotation.JsonProperty;

import java.util.List;

public class Rooms {

    @JsonProperty
    private List<Room> rooms;

    public Rooms(List<Room> rooms) {
        this.rooms = rooms;
    }

    public Rooms() {
    }

    public List<Room> getRooms() {
        return rooms;
    }

    public void setRooms(List<Room> rooms) {
        this.rooms = rooms;
    }

    @Override
    public String toString() {
        return "Rooms{" +
                "rooms=" + rooms +
                '}';
    }
}
