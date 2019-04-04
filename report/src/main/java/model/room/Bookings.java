package model.room;

import com.fasterxml.jackson.annotation.JsonProperty;

import java.util.List;

public class Bookings {

    @JsonProperty
    private List<Booking> bookings;

    public Bookings() {
    }

    public List<Booking> getBookings() {
        return bookings;
    }

    public void setBookings(List<Booking> bookings) {
        this.bookings = bookings;
    }
}
