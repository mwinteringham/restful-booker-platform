package com.automationintesting.requests;

import com.automationintesting.model.room.Bookings;
import org.springframework.http.ResponseEntity;
import org.springframework.web.client.RestTemplate;

public class BookingRequests {

    private String host;

    public BookingRequests() {
        if(System.getenv("roomDomain") == null){
            host = "http://localhost:3000/booking";
        } else {
            host = "http://" + System.getenv("bookingDomain") + ":3000/booking";
        }
    }

    public Bookings getBookings(int roomid){
        RestTemplate restTemplate = new RestTemplate();

        return restTemplate.getForEntity(host + "/?roomid=" + roomid, Bookings.class).getBody();
    }

}
