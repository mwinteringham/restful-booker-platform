package com.automationintesting.api;

import com.automationintesting.model.db.Booking;
import com.automationintesting.model.db.Bookings;
import com.automationintesting.model.db.CreatedBooking;
import com.automationintesting.model.service.BookingResult;
import com.automationintesting.service.BookingService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import javax.validation.Valid;
import java.sql.SQLException;
import java.util.Optional;

@RestController
public class BookingController {

    @Autowired
    private BookingService bookingService;

    @RequestMapping(value = "/", method = RequestMethod.GET)
    public ResponseEntity getBookings(@RequestParam("roomid") Optional<String> roomid, @CookieValue(value ="token", required = false) String token) throws SQLException {
        BookingResult bookingResult = bookingService.getBookings(roomid, token);

        return ResponseEntity.status(bookingResult.getStatus()).body(bookingResult.getBookings());
    }

    @RequestMapping(value = "/", method = RequestMethod.POST)
    public ResponseEntity createBooking(@Valid @RequestBody Booking booking) throws SQLException {
        BookingResult bookingResult = bookingService.createBooking(booking);

        return ResponseEntity.status(bookingResult.getStatus()).body(bookingResult.getCreatedBooking());
    }

    @RequestMapping(value = "/{id:[0-9]*}", method = RequestMethod.GET)
    public ResponseEntity getBooking(@PathVariable(value = "id") int bookingId, @CookieValue(value ="token", required = false) String token) throws SQLException {
        BookingResult bookingResult = bookingService.getIndividualBooking(bookingId, token);

        return ResponseEntity.status(bookingResult.getStatus()).body(bookingResult.getBooking());
    }

    @RequestMapping(value = "/{id:[0-9]*}", method = RequestMethod.DELETE)
    public ResponseEntity deleteBooking(@PathVariable(value = "id") int id, @CookieValue(value ="token", required = false) String token) throws SQLException {
        HttpStatus deleteHttpStatus = bookingService.deleteBooking(id, token);

        return ResponseEntity.status(deleteHttpStatus).build();
    }

    @RequestMapping(value = "/{id:[0-9]*}", method = RequestMethod.PUT)
    public ResponseEntity<CreatedBooking> updateBooking(@Valid @RequestBody Booking booking, @PathVariable(value = "id") int id, @CookieValue(value ="token", required = false) String token) throws SQLException {
        BookingResult updateResult = bookingService.updateBooking(id, booking, token);

        return ResponseEntity.status(updateResult.getStatus()).body(updateResult.getCreatedBooking());
    }

    @RequestMapping(value = "/summary", method = RequestMethod.GET)
    public ResponseEntity getSummaries(@RequestParam("roomid") String roomid) throws SQLException {
        Bookings bookingSummaries = bookingService.getBookingSummaries(roomid);

        return ResponseEntity.status(HttpStatus.OK).body(bookingSummaries);
    }

}
