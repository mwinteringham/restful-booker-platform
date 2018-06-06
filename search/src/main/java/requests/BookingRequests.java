package requests;

import model.BookingSearchResults;
import model.SearchResults;
import org.springframework.http.ResponseEntity;
import org.springframework.web.client.RestTemplate;

public class BookingRequests {

    private String host;

    public BookingRequests() {
        if(System.getenv("bookingDomain") == null){
            host = "http://localhost:3000/booking";
        } else {
            host = "http://" + System.getenv("bookingDomain") + ":3000/booking";
        }
    }

    public ResponseEntity<BookingSearchResults> searchForBookings(String name){
        RestTemplate restTemplate = new RestTemplate();

        return restTemplate.getForEntity(host + "?keyword=" + name, BookingSearchResults.class);
    }

}
