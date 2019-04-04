package requests;

import model.room.Room;
import model.room.Rooms;
import org.springframework.http.ResponseEntity;
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

    public ResponseEntity<Rooms> searchForRooms(){
        RestTemplate restTemplate = new RestTemplate();

        return restTemplate.getForEntity(host, Rooms.class);
    }

    public ResponseEntity<Room> searchForSpecificRoom(String id){
        RestTemplate restTemplate = new RestTemplate();

        return restTemplate.getForEntity(host + "/" + id, Room.class);
    }

}
