package api;

import model.Booking;
import model.Report;
import model.Room;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestMethod;
import org.springframework.web.bind.annotation.RestController;
import requests.RoomRequests;


import java.sql.SQLException;
import java.util.List;

@RestController
public class ReportController {

    private RoomRequests roomRequests;

    public ReportController() throws SQLException {
        roomRequests = new RoomRequests();
    }

    @CrossOrigin
    @RequestMapping(value = "/report", method = RequestMethod.GET)
    public Report createBooking() throws SQLException {
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
