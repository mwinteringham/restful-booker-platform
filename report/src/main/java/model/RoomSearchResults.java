package model;

import com.fasterxml.jackson.annotation.JsonProperty;

import java.util.List;

public class RoomSearchResults {

    @JsonProperty
    private List<Room> rooms;

    public RoomSearchResults(List<Room> rooms) {
        this.rooms = rooms;
    }

    public RoomSearchResults() {
    }

    public List<Room> getRooms() {
        return rooms;
    }

    public void setRooms(List<Room> rooms) {
        this.rooms = rooms;
    }
}
