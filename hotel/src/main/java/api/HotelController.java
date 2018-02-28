package api;

import db.HotelDB;
import model.Booking;
import model.CreatedHotel;
import model.Hotel;
import model.SearchResults;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import requests.Auth;
import requests.Search;

import java.sql.SQLException;
import java.util.List;

@RestController
public class HotelController {

    private HotelDB hotelDB;

    public HotelController() throws SQLException {
        hotelDB = new HotelDB();
    }

    @CrossOrigin(value = "*")
    @RequestMapping(value = "/hotel", method = RequestMethod.GET)
    public List<Hotel> getHotels() throws SQLException {
        return hotelDB.queryHotels();
    }

    @CrossOrigin(value = "*")
    @RequestMapping(value = "/hotel", method = RequestMethod.POST)
    public ResponseEntity<CreatedHotel> createHotel(@RequestBody Hotel hotel, @CookieValue(value ="token", required = false) String token) throws SQLException {
        if(Auth.postCheckAuth(token)){
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
        List<Booking> results = Search.searchForBookings(queriedHotel.getHotelid()).getBody().getBookings();
        queriedHotel.setBookings(results);

        return queriedHotel;
    }

    @CrossOrigin(value = "*")
    @RequestMapping(value = "/hotel/{id}", method = RequestMethod.DELETE)
    public ResponseEntity deleteHotel(@PathVariable(value = "id") int id, @CookieValue(value ="token", required = false) String token) throws SQLException {
        if(Auth.postCheckAuth(token)){
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
        if(Auth.postCheckAuth(token)){
            return ResponseEntity.ok(hotelDB.update(id, booking));
        } else {
            return ResponseEntity.status(HttpStatus.FORBIDDEN).build();
        }
    }

}
