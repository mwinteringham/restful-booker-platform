package requests;

import model.RoomSearchResults;
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

    public ResponseEntity<RoomSearchResults> searchForRooms(String name){
        RestTemplate restTemplate = new RestTemplate();

        return restTemplate.getForEntity(host + "?keyword=" + name, RoomSearchResults.class);
    }
}
