package model;

import com.fasterxml.jackson.annotation.JsonProperty;

import java.util.List;

public class SearchResults {

    @JsonProperty
    private List<Booking> bookings;

    public SearchResults() {
    }

    public SearchResults(List<Booking> bookings) {
        this.bookings = bookings;
    }

    public List<Booking> getBookings() {
        return bookings;
    }

    public void setBookings(List<Booking> bookings) {
        this.bookings = bookings;
    }
}
