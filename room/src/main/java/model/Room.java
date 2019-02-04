package model;

import com.fasterxml.jackson.annotation.JsonProperty;

import java.sql.Array;
import java.sql.ResultSet;
import java.sql.SQLException;
import java.util.Arrays;
import java.util.Date;
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
    private String image;
    @JsonProperty
    private String description;
    @JsonProperty
    private String[] features;
    @JsonProperty
    private List<Booking> bookings;

    public Room() {
    }

    public Room(int roomNumber, String type, int beds, boolean accessible, String image, String description, String[] features) {
        this.roomNumber = roomNumber;
        this.type = type;
        this.beds = beds;
        this.accessible = accessible;
        this.image = image;
        this.description = description;
        this.features = features;
    }

    public Room(ResultSet result) throws SQLException {
        this.roomid = result.getInt("roomid");
        this.roomNumber = result.getInt("room_number");
        this.type = result.getString("type");
        this.beds = result.getInt("beds");
        this.accessible = result.getBoolean("accessible");
        this.image = result.getString("image");
        this.description = result.getString("description");
        
        Array featuresArray = result.getArray("features");
        this.features = (String[])featuresArray.getArray();
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

    public String getDescription() {
        return description;
    }

    public void setDescription(String details) {
        this.description = details;
    }

    public String getImage() {
        return image;
    }

    public void setImage(String image) {
        this.image = image;
    }

    public String[] getFeatures() {
        return features;
    }

    public void setFeatures(String[] features) {
        this.features = features;
    }

    public List<Booking> getBookings() {
        return bookings;
    }

    public void setBookings(List<Booking> bookings) {
        this.bookings = bookings;
    }

    @Override
    public String toString() {
        return "Room{" +
                "\nroomid=" + roomid +
                "\n, roomNumber=" + roomNumber +
                "\n, type='" + type + '\'' +
                "\n, beds=" + beds +
                "\n, accessible=" + accessible +
                "\n, image='" + image + '\'' +
                "\n, description='" + description + '\'' +
                "\n, features=" + Arrays.toString(features) +
                "\n, bookings=" + bookings +
                "\n}";
    }
}
