package model;

import com.fasterxml.jackson.annotation.JsonProperty;

import java.util.List;

public class Hotels {

    @JsonProperty
    private List<Hotel> hotels;

    public Hotels(List<Hotel> hotels) {
        this.hotels = hotels;
    }

    public Hotels() {
    }

    public List<Hotel> getHotels() {
        return hotels;
    }

    public void setHotels(List<Hotel> hotels) {
        this.hotels = hotels;
    }
}
