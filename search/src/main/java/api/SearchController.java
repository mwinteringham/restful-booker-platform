package api;

import model.Booking;
import model.Room;
import model.SearchResults;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import requests.BookingRequests;
import requests.RoomRequests;

import java.sql.SQLException;
import java.util.List;
import java.util.Optional;

@RestController
public class SearchController {

    private BookingRequests requestBooking;
    private RoomRequests requestRoom;

    public SearchController() throws SQLException {
        requestBooking = new BookingRequests();
        requestRoom = new RoomRequests();
    }

    @CrossOrigin(value = "*")
    @RequestMapping(value = "/search", method = RequestMethod.GET)
    public ResponseEntity<SearchResults> getSearchResults(@RequestParam("keyword") Optional<String> keyword) throws SQLException {
        if(keyword.isPresent()){
            List<Booking> bookings = requestBooking.searchForBookings(keyword.get()).getBody().getBookings();
            List<Room> rooms = requestRoom.searchForRooms(keyword.get()).getBody().getRooms();

            return ResponseEntity.ok(new SearchResults(bookings, rooms));
        }

        return ResponseEntity.ok().build();
    }

}
