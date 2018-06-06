package api;

import db.HotelDB;
import model.CreatedHotel;
import model.Hotel;
import model.Hotels;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import requests.AuthRequests;
import requests.BookingRequests;

import java.sql.SQLException;
import java.util.List;
import java.util.Optional;

@RestController
public class HotelController {

    private HotelDB hotelDB;
    private AuthRequests authRequest;
    private BookingRequests bookingRequest;

    public HotelController() throws SQLException {
        hotelDB = new HotelDB();
        authRequest = new AuthRequests();
        bookingRequest = new BookingRequests();
    }

    @CrossOrigin(value = "*")
    @RequestMapping(value = "/hotel", method = RequestMethod.GET)
    public ResponseEntity<Hotels> getHotels(@RequestParam("keyword") Optional<String> keyword) throws SQLException {
        if(keyword.isPresent()){
            return ResponseEntity.ok(new Hotels(hotelDB.searchHotels(keyword.get())));
        } else {
            return ResponseEntity.ok(new Hotels(hotelDB.queryHotels()));
        }
    }

    @CrossOrigin(value = "*")
    @RequestMapping(value = "/hotel", method = RequestMethod.POST)
    public ResponseEntity<CreatedHotel> createHotel(@RequestBody Hotel hotel, @CookieValue(value ="token", required = false) String token) throws SQLException {
        if(authRequest.postCheckAuth(token)){
            CreatedHotel body = hotelDB.create(hotel);
            return ResponseEntity.ok(body);
        } else {
            return ResponseEntity.status(HttpStatus.FORBIDDEN).build();
        }
    }

    @CrossOrigin(value = "*")
    @RequestMapping(value = "/hotel/{id}", method = RequestMethod.GET)
    public Hotel getHotel(@PathVariable(value = "id") int id) throws SQLException {
        Hotel queriedHotel = hotelDB.query(id);
        List<model.Booking> results = bookingRequest.searchForBookings(queriedHotel.getHotelid()).getBody().getBookings();
        queriedHotel.setBookings(results);

        return queriedHotel;
    }

    @CrossOrigin(value = "*")
    @RequestMapping(value = "/hotel/{id}", method = RequestMethod.DELETE)
    public ResponseEntity deleteHotel(@PathVariable(value = "id") int id, @CookieValue(value ="token", required = false) String token) throws SQLException {
        if(authRequest.postCheckAuth(token)){
            if(hotelDB.delete(id)){
                return ResponseEntity.accepted().build();
            } else {
                return ResponseEntity.notFound().build();
            }
        } else {
            return ResponseEntity.status(HttpStatus.FORBIDDEN).build();
        }
    }

    @CrossOrigin(value = "*")
    @RequestMapping(value = "/hotel/{id}", method = RequestMethod.PUT)
    public ResponseEntity<CreatedHotel> updateHotel(@RequestBody Hotel booking, @PathVariable(value = "id") int id, @CookieValue(value ="token", required = false) String token) throws SQLException {
        if(authRequest.postCheckAuth(token)){
            return ResponseEntity.ok(hotelDB.update(id, booking));
        } else {
            return ResponseEntity.status(HttpStatus.FORBIDDEN).build();
        }
    }

}
