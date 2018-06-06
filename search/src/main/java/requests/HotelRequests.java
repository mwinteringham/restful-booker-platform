package requests;

import model.HotelSearchResults;
import org.springframework.http.ResponseEntity;
import org.springframework.web.client.RestTemplate;

public class HotelRequests {

    private String host;

    public HotelRequests() {
        if(System.getenv("hotelDomain") == null){
            host = "http://localhost:3001/hotel";
        } else {
            host = "http://" + System.getenv("hotelDomain") + ":3001/hotel";
        }
    }

    public ResponseEntity<HotelSearchResults> searchForHotels(String name){
        RestTemplate restTemplate = new RestTemplate();

        return restTemplate.getForEntity(host + "?keyword=" + name, HotelSearchResults.class);
    }
}
