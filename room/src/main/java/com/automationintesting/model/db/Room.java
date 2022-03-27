package com.automationintesting.model.db;

import com.fasterxml.jackson.annotation.JsonProperty;

import javax.persistence.Entity;
import javax.validation.constraints.*;
import java.sql.ResultSet;
import java.sql.SQLException;
import java.util.Arrays;

@Entity
public class Room {

    @JsonProperty
    private int roomid;

    @JsonProperty
    @NotNull()
    @NotEmpty(message = "Room name must be set")
    private String roomName;

    @JsonProperty
    @NotNull(message = "Type must be set")
    @Pattern(regexp = "Single|Double|Twin|Family|Suite", message = "Type can only contain the room options Single, Double, Twin, Family or Suite")
    private String type;

    @JsonProperty
    private boolean accessible;

    @JsonProperty
    private String image;

    @JsonProperty
    private String description;

    @JsonProperty
    private String[] features;

    @JsonProperty
    @Min(1)
    @Max(999)
    private int roomPrice;

    public Room() {
    }

    public Room(String roomName, String type, boolean accessible, String image, String description, String[] features, int roomPrice) {
        this.roomName = roomName;
        this.type = type;
        this.accessible = accessible;
        this.image = image;
        this.description = description;
        this.features = features;
        this.roomPrice = roomPrice;
    }

    public Room(ResultSet result) throws SQLException {
        this.roomid = result.getInt("roomid");
        this.roomName = result.getString("room_name");
        this.type = result.getString("type");
        this.accessible = result.getBoolean("accessible");
        this.image = result.getString("image");
        this.description = result.getString("description");
        this.roomPrice = result.getInt("roomPrice");

        Object[] featuresArray = (Object[]) result.getArray("features").getArray();
        String[] featureStringArray = new String[featuresArray.length];

        for (int i = 0; i < featuresArray.length; i++) {
            featureStringArray[i] = (String) featuresArray[i];
        }

        this.features = featureStringArray;
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

    public int getRoomPrice() {
        return roomPrice;
    }

    public void setRoomPrice(int roomPrice) {
        this.roomPrice = roomPrice;
    }

    @Override
    public String toString() {
        return "Room{" +
                "roomid=" + roomid +
                ", roomName='" + roomName + '\'' +
                ", type='" + type + '\'' +
                ", accessible=" + accessible +
                ", image='" + image + '\'' +
                ", description='" + description + '\'' +
                ", features=" + Arrays.toString(features) +
                ", roomPrice=" + roomPrice +
                '}';
    }

    public static class RoomBuilder {

        private int roomid;
        private String roomName;
        private String type;
        private boolean accessible;
        private String image;
        private String description;
        private String[] features;
        private int roomPrice;

        public RoomBuilder setRoomid(int roomid) {
            this.roomid = roomid;

            return this;
        }

        public RoomBuilder setRoomName(String roomName) {
            this.roomName = roomName;

            return this;
        }

        public RoomBuilder setType(String type) {
            this.type = type;

            return this;
        }

        public RoomBuilder setAccessible(boolean accessible) {
            this.accessible = accessible;

            return this;
        }

        public RoomBuilder setImage(String image) {
            this.image = image;

            return this;
        }

        public RoomBuilder setDescription(String description) {
            this.description = description;

            return this;
        }

        public RoomBuilder setFeatures(String[] features) {
            this.features = features;

            return this;
        }

        public RoomBuilder setRoomPrice(int roomPrice) {
            this.roomPrice = roomPrice;

            return this;
        }

        public Room build(){
            return new Room(roomName, type, accessible, image, description, features, roomPrice);
        }
    }
}
