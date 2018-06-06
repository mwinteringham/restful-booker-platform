package requests;

import model.Hotel;
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

    public ResponseEntity<HotelSearchResults> searchForHotels(){
        RestTemplate restTemplate = new RestTemplate();

        return restTemplate.getForEntity(host, HotelSearchResults.class);
    }

    public ResponseEntity<Hotel> searchForSpecificHotel(String id){
        RestTemplate restTemplate = new RestTemplate();

        return restTemplate.getForEntity(host + "/" + id, Hotel.class);
    }
}
