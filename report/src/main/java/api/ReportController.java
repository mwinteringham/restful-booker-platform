package api;

import model.Booking;
import model.Report;
import model.Room;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.context.annotation.Bean;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestMethod;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.servlet.config.annotation.CorsRegistry;
import org.springframework.web.servlet.config.annotation.WebMvcConfigurer;
import requests.RoomRequests;


import java.sql.SQLException;
import java.util.List;

@RestController
public class ReportController {

    private RoomRequests roomRequests;

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

    public ReportController() throws SQLException {
        roomRequests = new RoomRequests();
    }

    @RequestMapping(value = "/", method = RequestMethod.GET)
    public Report returnReport() throws SQLException {
        List<Room> rooms = roomRequests.searchForRooms().getBody().getRooms();

        int[] roomNumbers = new int[rooms.size()];
        int[] totals = new int[rooms.size()];
        int count = 0;

        for(Room h : rooms){
            int total = 0;
            List<Booking> roomBookings = roomRequests.searchForSpecificRoom(Integer.toString(h.getRoomid())).getBody().getBookings();

            for(Booking b : roomBookings){
                total += b.getTotalprice();
            }

            roomNumbers[count] = h.getRoomNumber();
            totals[count] = total;
            count++;
        }

        return new Report(roomNumbers, totals);
    }

}
