package model;

import com.fasterxml.jackson.annotation.JsonProperty;

import java.util.List;

public class HotelSearchResults {

    @JsonProperty
    private List<Hotel> hotels;

    public HotelSearchResults(List<Hotel> hotels) {
        this.hotels = hotels;
    }

    public HotelSearchResults() {
    }

    public List<Hotel> getHotels() {
        return hotels;
    }

    public void setHotels(List<Hotel> hotels) {
        this.hotels = hotels;
    }
}
