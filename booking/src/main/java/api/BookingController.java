package api;

import db.BookingDB;
import model.Booking;
import model.CreatedBooking;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import requests.Auth;

import java.sql.SQLException;

@RestController
public class BookingController {

    BookingDB bookingDB;

    public BookingController() throws SQLException {
        bookingDB = new BookingDB();
    }

    @CrossOrigin
    @RequestMapping(value = "/booking", method = RequestMethod.POST)
    public ResponseEntity<CreatedBooking> createBooking(@RequestBody Booking booking, @CookieValue(value ="token", required = false) String token) throws SQLException {
        if(Auth.postCheckAuth(token)){
            CreatedBooking body = bookingDB.create(booking);
            return ResponseEntity.ok(body);
        } else {
            return ResponseEntity.status(HttpStatus.FORBIDDEN).build();
        }
    }


    @CrossOrigin
    @RequestMapping(value = "/booking/{id}", method = RequestMethod.GET)
    public Booking getBooking(@PathVariable(value = "id") int id) throws SQLException {
        return bookingDB.query(id);
    }

    @CrossOrigin
    @RequestMapping(value = "/booking/{id}", method = RequestMethod.DELETE)
    public ResponseEntity deleteBooking(@PathVariable(value = "id") int id, @CookieValue(value ="token", required = false) String token) throws SQLException {
        if(Auth.postCheckAuth(token)){
            if(bookingDB.delete(id)){
                return ResponseEntity.accepted().build();
            } else {
                return ResponseEntity.notFound().build();
            }
        } else {
            return ResponseEntity.status(HttpStatus.FORBIDDEN).build();
        }
    }

    @CrossOrigin
    @RequestMapping(value = "/booking/{id}", method = RequestMethod.PUT)
    public ResponseEntity<CreatedBooking> updateBooking(@RequestBody Booking booking, @PathVariable(value = "id") int id, @CookieValue(value ="token", required = false) String token) throws SQLException {
        if(Auth.postCheckAuth(token)){
            return ResponseEntity.ok(bookingDB.update(id, booking));
        } else {
            return ResponseEntity.status(HttpStatus.FORBIDDEN).build();
        }
    }

}
