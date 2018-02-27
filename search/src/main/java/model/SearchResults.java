package model;

import com.fasterxml.jackson.annotation.JsonProperty;

import java.util.List;

public class SearchResults {

    @JsonProperty
    private List<Booking> bookings;

    @JsonProperty
    private List<Hotel> hotels;

    public SearchResults() {
    }

    public SearchResults(List<Booking> bookings, List<Hotel> hotels) {
        this.bookings = bookings;
        this.hotels = hotels;
    }

    public List<Booking> getBookings() {
        return bookings;
    }

    public void setBookings(List<Booking> bookings) {
        this.bookings = bookings;
    }

    public List<Hotel> getHotels() {
        return hotels;
    }

    public void setHotels(List<Hotel> hotels) {
        this.hotels = hotels;
    }
}
