package model;

import com.fasterxml.jackson.annotation.JsonProperty;

import java.util.List;

public class BookingSearchResults {

    @JsonProperty
    private List<Booking> bookings;

    public BookingSearchResults(List<Booking> bookings) {
        this.bookings = bookings;
    }

    public BookingSearchResults() {
    }

    public List<Booking> getBookings() {
        return bookings;
    }

    public void setBookings(List<Booking> bookings) {
        this.bookings = bookings;
    }
}
