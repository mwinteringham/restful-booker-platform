package model;

import com.fasterxml.jackson.annotation.JsonProperty;

public class CreatedHotel {

    @JsonProperty
    private int hotelid;

    @JsonProperty
    private Hotel hotel;

    public CreatedHotel() {
    }

    public CreatedHotel(int hotelid, Hotel hotel) {
        this.hotelid = hotelid;
        this.hotel = hotel;
    }

    public int getHotelid() {
        return hotelid;
    }

    public void setHotelid(int hotelid) {
        this.hotelid = hotelid;
    }

    public Hotel getHotel() {
        return hotel;
    }

    public void setHotel(Hotel hotel) {
        this.hotel = hotel;
    }
}
