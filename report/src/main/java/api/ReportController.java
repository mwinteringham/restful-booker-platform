package api;

import model.Booking;
import model.Hotel;
import model.Report;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestMethod;
import org.springframework.web.bind.annotation.RestController;
import requests.HotelRequests;

import java.sql.SQLException;
import java.util.ArrayList;
import java.util.List;

@RestController
public class ReportController {

    private HotelRequests hotelRequests;

    public ReportController() throws SQLException {
        hotelRequests = new HotelRequests();
    }

    @CrossOrigin
    @RequestMapping(value = "/report", method = RequestMethod.GET)
    public Report createBooking() throws SQLException {
        List<String> hotelNames = new ArrayList<>();
        List<Hotel> hotels = hotelRequests.searchForHotels().getBody().getHotels();
        int[] totals = new int[hotels.size()];
        int count = 0;

        for(Hotel h : hotels){
            int total = 0;
            List<Booking> hotelBookings = hotelRequests.searchForSpecificHotel(Integer.toString(h.getHotelid())).getBody().getBookings();

            for(Booking b : hotelBookings){
                total += b.getTotalprice();
            }

            hotelNames.add(h.getName());
            totals[count] = total;
            count++;
        }

        return new Report(hotelNames, totals);
    }

}
