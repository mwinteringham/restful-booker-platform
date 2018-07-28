package api;

import model.Booking;
import model.SearchResults;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import requests.BookingRequests;

import java.sql.SQLException;
import java.util.List;
import java.util.Optional;

@RestController
public class SearchController {

    private BookingRequests requestBooking;

    public SearchController() throws SQLException {
        requestBooking = new BookingRequests();
    }

    @CrossOrigin(value = "*")
    @RequestMapping(value = "/search", method = RequestMethod.GET)
    public ResponseEntity<SearchResults> getSearchResults(@RequestParam("keyword") Optional<String> keyword) throws SQLException {
        if(keyword.isPresent()){
            List<Booking> bookings = requestBooking.searchForBookings(keyword.get()).getBody().getBookings();

            return ResponseEntity.ok(new SearchResults(bookings));
        }

        return ResponseEntity.ok().build();
    }

    @CrossOrigin
    @RequestMapping(value = "/", method = RequestMethod.GET)
    public ResponseEntity ping(){
        return ResponseEntity.status(HttpStatus.OK).build();
    }

}
