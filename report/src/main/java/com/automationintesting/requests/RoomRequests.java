package com.automationintesting.requests;

import com.automationintesting.model.room.Room;
import com.automationintesting.model.room.Rooms;
import org.springframework.web.client.RestTemplate;

public class RoomRequests {

    private String host;

    public RoomRequests() {
        if(System.getenv("roomDomain") == null){
            host = "http://localhost:3001/room";
        } else {
            host = "http://" + System.getenv("roomDomain") + ":3001/room";
        }
    }

    public Rooms searchForRooms(){
        RestTemplate restTemplate = new RestTemplate();

        return restTemplate.getForEntity(host, Rooms.class).getBody();
    }

    public Room searchForSpecificRoom(String id){
        RestTemplate restTemplate = new RestTemplate();

        return restTemplate.getForEntity(host + "/" + id, Room.class).getBody();
    }

}
