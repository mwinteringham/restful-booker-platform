package com.automationintesting.model.room;

import com.fasterxml.jackson.annotation.JsonProperty;

import java.util.List;

public class Room {

    @JsonProperty
    private int roomid;
    @JsonProperty
    private String roomName;
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

    public Room(int roomid, String roomName, String type, int beds, boolean accessible, String details) {
        this.roomid = roomid;
        this.roomName = roomName;
        this.type = type;
        this.beds = beds;
        this.accessible = accessible;
        this.details = details;
    }
    public int getRoomid() {
        return roomid;
    }

    public void setRoomid(int roomid) {
        this.roomid = roomid;
    }

    public String getRoomName() {
        return roomName;
    }

    public void setRoomName(String roomName) {
        this.roomName = roomName;
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
                    ", roomName=" + roomName +
                    ", type='" + type + '\'' +
                    ", beds=" + beds +
                    ", accessible=" + accessible +
                    ", details='" + details +
                    '}';
        } else {
            return "Room{" +
                    "roomid=" + roomid +
                    ", roomName=" + roomName +
                    ", type='" + type + '\'' +
                    ", beds=" + beds +
                    ", accessible=" + accessible +
                    ", details='" + details + '\'' +
                    ", bookings=" + bookings.toString() +
                    '}';
        }
    }
}
