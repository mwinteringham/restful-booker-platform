package requests;

import model.SearchResults;
import org.springframework.http.ResponseEntity;
import org.springframework.web.client.RestTemplate;

public class Search {

    final static String uri = "http://" + System.getenv("searchDomain") + ":3002/search";

    public static ResponseEntity<SearchResults> searchForBookings(int hotelid){
        RestTemplate restTemplate = new RestTemplate();

        return restTemplate.getForEntity(uri + "?hotelid=" + hotelid, SearchResults.class);
    }

}
