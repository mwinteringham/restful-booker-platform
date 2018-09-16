package api;

import db.RoomDB;
import model.Room;
import model.Rooms;
import org.springframework.context.annotation.Bean;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.servlet.config.annotation.CorsRegistry;
import org.springframework.web.servlet.config.annotation.WebMvcConfigurer;
import requests.AuthRequests;
import requests.BookingRequests;
import utils.DatabaseScheduler;

import java.sql.SQLException;
import java.util.List;
import java.util.Optional;
import java.util.concurrent.TimeUnit;

@RestController
public class RoomController {

    private RoomDB roomDB;
    private AuthRequests authRequest;
    private BookingRequests bookingRequest;

    @Bean
    public WebMvcConfigurer configurer() {
        DatabaseScheduler databaseScheduler = new DatabaseScheduler();
        databaseScheduler.startScheduler(roomDB, TimeUnit.MINUTES);

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

    public RoomController() throws SQLException {
        roomDB = new RoomDB();
        authRequest = new AuthRequests();
        bookingRequest = new BookingRequests();
    }

    @RequestMapping(value = "/", method = RequestMethod.GET)
    public ResponseEntity<Rooms> getRooms(@RequestParam("keyword") Optional<String> keyword) throws SQLException {
        return ResponseEntity.ok(new Rooms(roomDB.queryRooms()));
    }

    @RequestMapping(value = "/", method = RequestMethod.POST)
    public ResponseEntity<Room> createRoom(@RequestBody Room room, @CookieValue(value ="token", required = false) String token) throws SQLException {
        if(authRequest.postCheckAuth(token)){
            Room body = roomDB.create(room);
            return ResponseEntity.ok(body);
        } else {
            return ResponseEntity.status(HttpStatus.FORBIDDEN).build();
        }
    }

    @RequestMapping(value = "/{id:[0-9]*}", method = RequestMethod.GET)
    public Room getRoom(@PathVariable(value = "id") int id) throws SQLException {
        Room queriedRoom = roomDB.query(id);
        List<model.Booking> results = bookingRequest.searchForBookings(queriedRoom.getRoomid()).getBody().getBookings();
        queriedRoom.setBookings(results);

        return queriedRoom;
    }

    @RequestMapping(value = "/{id:[0-9]*}", method = RequestMethod.DELETE)
    public ResponseEntity deleteRoom(@PathVariable(value = "id") int id, @CookieValue(value ="token", required = false) String token) throws SQLException {
        if(authRequest.postCheckAuth(token)){
            if(roomDB.delete(id)){
                return ResponseEntity.accepted().build();
            } else {
                return ResponseEntity.notFound().build();
            }
        } else {
            return ResponseEntity.status(HttpStatus.FORBIDDEN).build();
        }
    }

    @RequestMapping(value = "/{id:[0-9]*}", method = RequestMethod.PUT)
    public ResponseEntity<Room> updateRoom(@RequestBody Room booking, @PathVariable(value = "id") int id, @CookieValue(value ="token", required = false) String token) throws SQLException {
        if(authRequest.postCheckAuth(token)){
            return ResponseEntity.ok(roomDB.update(id, booking));
        } else {
            return ResponseEntity.status(HttpStatus.FORBIDDEN).build();
        }
    }

}
