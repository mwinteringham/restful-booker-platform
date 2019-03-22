package api;

import model.report.Report;
import model.report.RoomReport;
import model.report.RoomReportDate;
import model.room.Booking;
import model.room.Bookings;
import model.room.Room;
import org.springframework.context.annotation.Bean;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestMethod;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.servlet.config.annotation.CorsRegistry;
import org.springframework.web.servlet.config.annotation.WebMvcConfigurer;
import requests.BookingRequests;
import requests.RoomRequests;


import java.sql.SQLException;
import java.util.*;

@RestController
public class ReportController {

    private RoomRequests roomRequests;
    private BookingRequests bookingRequests;

    @Bean
    public WebMvcConfigurer corsConfigurer() {
        return new WebMvcConfigurer() {
            @Override
            public void addCorsMappings(CorsRegistry registry) {
                String originHost = "http://localhost:3003";

                if(System.getenv("cors") != null){
                    originHost = System.getenv("cors");
                }

                registry.addMapping("/*")
                        .allowedOrigins(originHost)
                        .allowCredentials(true);
            }
        };
    }

    public ReportController() throws SQLException {
        roomRequests = new RoomRequests();
        bookingRequests = new BookingRequests();
    }

    @RequestMapping(value = "/", method = RequestMethod.GET)
    public Report returnReport() throws SQLException {
        List<Room> rooms = roomRequests.searchForRooms().getBody().getRooms();
        List<RoomReport> parsedRooms = new ArrayList<>();

        for(Room r : rooms){
            List<RoomReportDate> dateList = new ArrayList<>();
            Bookings roomBookings = bookingRequests.getBookings(r.getRoomid()).getBody();

            for(Booking b : roomBookings.getBookings()){
                dateList = DateRange.parse(dateList, b.getBookingDates().getCheckin(), b.getBookingDates().getCheckout());
            }

            RoomReport roomReport = new RoomReport("" + r.getRoomNumber(), dateList);
            parsedRooms.add(roomReport);
        }

        return new Report(parsedRooms);
    }

}
