package com.automationintesting.model.room;

import com.fasterxml.jackson.annotation.JsonProperty;

import java.sql.ResultSet;
import java.sql.SQLException;
import java.util.List;

public class Room {

    @JsonProperty
    private int roomid;
    @JsonProperty
    private int roomNumber;
    @JsonProperty
    private String type;
    @JsonProperty
    private int beds;
    @JsonProperty
    private boolean accessible;
    @JsonProperty
    private String details;
    @JsonProperty
    private List<Booking> bookings;

    public Room() {
    }

    public Room(int roomid, int roomNumber, String type, int beds, boolean accessible, String details) {
        this.roomid = roomid;
        this.roomNumber = roomNumber;
        this.type = type;
        this.beds = beds;
        this.accessible = accessible;
        this.details = details;
    }

    public Room(ResultSet result) throws SQLException {
        this.roomid = result.getInt("roomid");
        this.roomNumber = result.getInt("room_number");
        this.type = result.getString("type");
        this.beds = result.getInt("beds");
        this.accessible = result.getBoolean("accessible");
        this.details = result.getString("details");
    }

    public int getRoomid() {
        return roomid;
    }

    public void setRoomid(int roomid) {
        this.roomid = roomid;
    }

    public int getRoomNumber() {
        return roomNumber;
    }

    public void setRoomNumber(int roomNumber) {
        this.roomNumber = roomNumber;
    }

    public String getType() {
        return type;
    }

    public void setType(String type) {
        this.type = type;
    }

    public int getBeds() {
        return beds;
    }

    public void setBeds(int beds) {
        this.beds = beds;
    }

    public boolean isAccessible() {
        return accessible;
    }

    public void setAccessible(boolean accessible) {
        this.accessible = accessible;
    }

    public String getDetails() {
        return details;
    }

    public void setDetails(String details) {
        this.details = details;
    }

    public List<Booking> getBookings() {
        return bookings;
    }

    public void setBookings(List<Booking> bookings) {
        this.bookings = bookings;
    }

    @Override
    public String toString() {
        if(bookings == null){
            return "Room{" +
                    "roomid=" + roomid +
                    ", roomNumber=" + roomNumber +
                    ", type='" + type + '\'' +
                    ", beds=" + beds +
                    ", accessible=" + accessible +
                    ", details='" + details +
                    '}';
        } else {
            return "Room{" +
                    "roomid=" + roomid +
                    ", roomNumber=" + roomNumber +
                    ", type='" + type + '\'' +
                    ", beds=" + beds +
                    ", accessible=" + accessible +
                    ", details='" + details + '\'' +
                    ", bookings=" + bookings.toString() +
                    '}';
        }
    }
}
