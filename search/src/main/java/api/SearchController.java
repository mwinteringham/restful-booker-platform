package api;

import model.Booking;
import model.Hotel;
import model.SearchResults;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import requests.BookingRequests;
import requests.HotelRequests;

import java.sql.SQLException;
import java.util.List;
import java.util.Optional;

@RestController
public class SearchController {

    private BookingRequests requestBooking;
    private HotelRequests requestHotel;

    public SearchController() throws SQLException {
        requestBooking = new BookingRequests();
        requestHotel = new HotelRequests();
    }

    @CrossOrigin(value = "*")
    @RequestMapping(value = "/search", method = RequestMethod.GET)
    public ResponseEntity<SearchResults> getHotels(@RequestParam("keyword") Optional<String> keyword) throws SQLException {
        if(keyword.isPresent()){
            List<Booking> bookings = requestBooking.searchForBookings(keyword.get()).getBody().getBookings();
            List<Hotel> hotels = requestHotel.searchForHotels(keyword.get()).getBody().getHotels();

            return ResponseEntity.ok(new SearchResults(bookings, hotels));
        }

        return ResponseEntity.ok().build();
    }

}
