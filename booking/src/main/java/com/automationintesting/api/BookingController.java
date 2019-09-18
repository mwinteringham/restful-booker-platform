package com.automationintesting.api;

import com.automationintesting.service.BookingApp;
import com.automationintesting.db.BookingDB;
import com.automationintesting.model.*;
import com.automationintesting.requests.MessageRequests;
import com.automationintesting.service.MessageBuilder;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import com.automationintesting.requests.AuthRequests;
import com.automationintesting.service.DateCheckValidator;

import javax.validation.Valid;
import java.sql.SQLException;
import java.util.Optional;

@RestController
public class BookingController {

    @Autowired
    private BookingDB bookingDB;
    private AuthRequests authRequests;
    private MessageRequests messageRequests;
    private DateCheckValidator dateCheckValidator;

    @Autowired
    private BookingApp bookingApp;

    public BookingController() throws SQLException {
        authRequests = new AuthRequests();
        messageRequests = new MessageRequests();
        dateCheckValidator = new DateCheckValidator();
    }

    @RequestMapping(value = "/", method = RequestMethod.GET)
    public ResponseEntity<BookingResults> getBookings(@RequestParam("roomid") Optional<String> roomid) throws SQLException {
        BookingResults searchResults = bookingApp.getBookings(roomid);

        return ResponseEntity.ok(searchResults);
    }

    @RequestMapping(value = "/", method = RequestMethod.POST)
    public ResponseEntity<?> createBooking(@Valid @RequestBody Booking booking, @CookieValue(value ="token", required = false) String token) throws SQLException {
        if(dateCheckValidator.isValid(booking.getBookingDates())) {
            if (bookingDB.checkForBookingConflict(booking)) {
                return ResponseEntity.status(HttpStatus.CONFLICT).build();
            } else {
                CreatedBooking body = bookingDB.create(booking);

                if(booking.getEmail() != null && booking.getPhone() != null){
                    MessageBuilder messageBuilder = new MessageBuilder();
                    Message message = messageBuilder.build(booking);
                    messageRequests.postMessage(message);
                }

                return ResponseEntity.ok(body);
            }
        } else {
            return ResponseEntity.status(HttpStatus.CONFLICT).build();
        }
    }

    @RequestMapping(value = "/{id:[0-9]*}", method = RequestMethod.GET)
    public ResponseEntity getBooking(@PathVariable(value = "id") int bookingId) throws SQLException {
        BookingResult bookingResult = bookingApp.getIndividualBooking(bookingId);

        return ResponseEntity.status(bookingResult.getStatus()).body(bookingResult.getBooking());
    }

    @RequestMapping(value = "/{id:[0-9]*}", method = RequestMethod.DELETE)
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

    @RequestMapping(value = "/{id:[0-9]*}", method = RequestMethod.PUT)
    public ResponseEntity<CreatedBooking> updateBooking(@Valid @RequestBody Booking booking, @PathVariable(value = "id") int id, @CookieValue(value ="token", required = false) String token) throws SQLException {
        if(authRequests.postCheckAuth(token)){
            return ResponseEntity.ok(bookingDB.update(id, booking));
        } else {
            return ResponseEntity.status(HttpStatus.FORBIDDEN).build();
        }
    }

}
