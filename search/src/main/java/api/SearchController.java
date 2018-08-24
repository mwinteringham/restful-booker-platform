package api;

import model.Booking;
import model.SearchResults;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.context.annotation.Bean;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.servlet.config.annotation.CorsRegistry;
import org.springframework.web.servlet.config.annotation.WebMvcConfigurer;
import requests.BookingRequests;

import java.sql.SQLException;
import java.util.List;
import java.util.Optional;

@RestController
public class SearchController {

    private BookingRequests requestBooking;

    @Value("${cors.origin}")
    private String originHost;

    @Bean
    public WebMvcConfigurer corsConfigurer() {
        return new WebMvcConfigurer() {
            @Override
            public void addCorsMappings(CorsRegistry registry) {
                registry.addMapping("/*")
                        .allowedOrigins(originHost)
                        .allowCredentials(true);
            }
        };
    }

    public SearchController() throws SQLException {
        requestBooking = new BookingRequests();
    }

    @RequestMapping(value = "/", method = RequestMethod.GET)
    public ResponseEntity<SearchResults> getSearchResults(@RequestParam("keyword") Optional<String> keyword) throws SQLException {
        if(keyword.isPresent()){
            List<Booking> bookings = requestBooking.searchForBookings(keyword.get()).getBody().getBookings();

            return ResponseEntity.ok(new SearchResults(bookings));
        }

        return ResponseEntity.ok().build();
    }

}
