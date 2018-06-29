package model;

import com.fasterxml.jackson.annotation.JsonProperty;

import java.util.List;

public class SearchResults {

    @JsonProperty
    private List<Booking> bookings;

    @JsonProperty
    private List<Room> rooms;

    public SearchResults() {
    }

    public SearchResults(List<Booking> bookings, List<Room> rooms) {
        this.bookings = bookings;
        this.rooms = rooms;
    }

    public List<Booking> getBookings() {
        return bookings;
    }

    public void setBookings(List<Booking> bookings) {
        this.bookings = bookings;
    }

    public List<Room> getRooms() {
        return rooms;
    }

    public void setRooms(List<Room> rooms) {
        this.rooms = rooms;
    }
}
