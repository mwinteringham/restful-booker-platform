package api;

import db.BookingDB;
import model.Booking;
import model.BookingResults;
import model.CreatedBooking;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.context.annotation.Bean;
import org.springframework.core.env.Environment;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.servlet.config.annotation.CorsRegistry;
import org.springframework.web.servlet.config.annotation.WebMvcConfigurer;
import requests.AuthRequests;
import utils.DatabaseScheduler;

import java.sql.SQLException;
import java.time.Instant;
import java.util.GregorianCalendar;
import java.util.Optional;
import java.util.concurrent.Executors;
import java.util.concurrent.ScheduledExecutorService;
import java.util.concurrent.TimeUnit;

@RestController
public class BookingController {

    private BookingDB bookingDB;
    private AuthRequests authRequests;

    @Value("${cors.origin}")
    private String originHost;

    @Bean
    public WebMvcConfigurer configurer() {
        if("true".equals(System.getenv("refresh"))){
            DatabaseScheduler.setupScheduler(bookingDB);
        }

        return new WebMvcConfigurer() {
            @Override
            public void addCorsMappings(CorsRegistry registry) {
                registry.addMapping("/*")
                        .allowedMethods("GET", "POST", "DELETE", "PUT")
                        .allowedOrigins(originHost)
                        .allowCredentials(true);
            }
        };
    }

    public BookingController() throws SQLException {
        bookingDB = new BookingDB();
        authRequests = new AuthRequests();
    }

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

    @RequestMapping(value = "/", method = RequestMethod.POST)
    public ResponseEntity<CreatedBooking> createBooking(@RequestBody Booking booking, @CookieValue(value ="token", required = false) String token) throws SQLException {
        if(authRequests.postCheckAuth(token)){
            CreatedBooking body = bookingDB.create(booking);
            return ResponseEntity.ok(body);
        } else {
            return ResponseEntity.status(HttpStatus.FORBIDDEN).build();
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
    public ResponseEntity<CreatedBooking> updateBooking(@RequestBody Booking booking, @PathVariable(value = "id") int id, @CookieValue(value ="token", required = false) String token) throws SQLException {
        if(authRequests.postCheckAuth(token)){
            return ResponseEntity.ok(bookingDB.update(id, booking));
        } else {
            return ResponseEntity.status(HttpStatus.FORBIDDEN).build();
        }
    }

}
