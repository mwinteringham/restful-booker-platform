package com.automationintesting.api;

import com.automationintesting.db.BookingDB;
import com.automationintesting.model.Booking;
import com.automationintesting.model.BookingResults;
import com.automationintesting.model.CreatedBooking;
import com.automationintesting.model.Message;
import com.automationintesting.requests.MessageRequests;
import com.automationintesting.utils.MessageBuilder;
import org.springframework.context.annotation.Bean;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.servlet.config.annotation.CorsRegistry;
import org.springframework.web.servlet.config.annotation.WebMvcConfigurer;
import com.automationintesting.requests.AuthRequests;
import com.automationintesting.utils.DatabaseScheduler;
import com.automationintesting.validators.DateCheckValidator;

import javax.validation.Valid;
import java.sql.SQLException;
import java.util.Optional;
import java.util.concurrent.TimeUnit;

@RestController
public class BookingController {

    private BookingDB bookingDB;
    private AuthRequests authRequests;
    private MessageRequests messageRequests;
    private DateCheckValidator dateCheckValidator;

    @Bean
    public WebMvcConfigurer configurer() {
        DatabaseScheduler databaseScheduler = new DatabaseScheduler();
        databaseScheduler.startScheduler(bookingDB, TimeUnit.MINUTES);

        return new WebMvcConfigurer() {
            @Override
            public void addCorsMappings(CorsRegistry registry) {
                String originHost = "http://localhost:3003";

                if(System.getenv("cors") != null){
                    originHost = System.getenv("cors");
                }

                registry.addMapping("/*")
                        .allowedMethods("GET", "POST", "DELETE", "PUT")
                        .allowedOrigins(originHost)
                        .allowCredentials(true);
            }
        };
    }

    public BookingController() throws SQLException {
        bookingDB = new BookingDB(true);
        authRequests = new AuthRequests();
        messageRequests = new MessageRequests();
        dateCheckValidator = new DateCheckValidator();
    }

    @RequestMapping(value = "/", method = RequestMethod.GET)
    public ResponseEntity<BookingResults> getBookings(@RequestParam("roomid") Optional<String> roomid) throws SQLException {
        if(roomid.isPresent()){
            BookingResults searchResults = new BookingResults(bookingDB.queryBookingsById(roomid.get()));
            return ResponseEntity.ok(searchResults);
        }

        return ResponseEntity.ok().build();
    }

    @RequestMapping(value = "/", method = RequestMethod.POST)
    public ResponseEntity<?> createBooking(@Valid @RequestBody Booking booking, @CookieValue(value ="token", required = false) String token) throws SQLException {
        if(dateCheckValidator.isValid(booking.getBookingDates())) {
            if (bookingDB.checkForBookingConflict(booking)) {
                return ResponseEntity.status(HttpStatus.CONFLICT).build();
            } else {
                CreatedBooking body = bookingDB.create(booking);

                MessageBuilder messageBuilder = new MessageBuilder();
                Message message = messageBuilder.build(booking);
                messageRequests.postMessage(message);

                return ResponseEntity.ok(body);
            }
        } else {
            return ResponseEntity.status(HttpStatus.CONFLICT).build();
        }
    }

    @RequestMapping(value = "/{id:[0-9]*}", method = RequestMethod.GET)
    public Booking getBooking(@PathVariable(value = "id") int id) throws SQLException {
        return bookingDB.query(id);
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
