package api;

import db.BookingDB;
import model.Booking;
import model.BookingResults;
import model.CreatedBooking;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import requests.AuthRequests;

import java.sql.SQLException;
import java.util.Optional;

@RestController
public class BookingController {

    BookingDB bookingDB;
    AuthRequests authRequests;

    public BookingController() throws SQLException {
        bookingDB = new BookingDB();
        authRequests = new AuthRequests();
    }

    @CrossOrigin
    @RequestMapping(value = "/", method = RequestMethod.GET)
    public ResponseEntity<BookingResults> getBookings(@RequestParam("roomid") Optional<String> roomid, @RequestParam("keyword") Optional<String> keyword) throws SQLException {
        if(roomid.isPresent()){
            BookingResults searchResults = new BookingResults(bookingDB.queryBookingsById(roomid.get()));
            return ResponseEntity.ok(searchResults);
        }

        if(keyword.isPresent()){
            BookingResults searchResults = new BookingResults(bookingDB.queryBookingsByName(keyword.get()));
            return ResponseEntity.ok(searchResults);
        }

        return ResponseEntity.ok().build();
    }

    @CrossOrigin
    @RequestMapping(value = "/", method = RequestMethod.POST)
    public ResponseEntity<CreatedBooking> createBooking(@RequestBody Booking booking, @CookieValue(value ="token", required = false) String token) throws SQLException {
        if(authRequests.postCheckAuth(token)){
            CreatedBooking body = bookingDB.create(booking);
            return ResponseEntity.ok(body);
        } else {
            return ResponseEntity.status(HttpStatus.FORBIDDEN).build();
        }
    }

    @CrossOrigin
    @RequestMapping(value = "/{id}", method = RequestMethod.GET)
    public Booking getBooking(@PathVariable(value = "id") int id) throws SQLException {
        return bookingDB.query(id);
    }

    @CrossOrigin
    @RequestMapping(value = "/{id}", method = RequestMethod.DELETE)
    public ResponseEntity deleteBooking(@PathVariable(value = "id") int id, @CookieValue(value ="token", required = false) String token) throws SQLException {
        if(authRequests.postCheckAuth(token)){
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
    @RequestMapping(value = "/{id}", method = RequestMethod.PUT)
    public ResponseEntity<CreatedBooking> updateBooking(@RequestBody Booking booking, @PathVariable(value = "id") int id, @CookieValue(value ="token", required = false) String token) throws SQLException {
        if(authRequests.postCheckAuth(token)){
            return ResponseEntity.ok(bookingDB.update(id, booking));
        } else {
            return ResponseEntity.status(HttpStatus.FORBIDDEN).build();
        }
    }

}
