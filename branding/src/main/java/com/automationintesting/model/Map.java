package com.automationintesting.model;

import com.fasterxml.jackson.annotation.JsonProperty;

public class Map {

    @JsonProperty
    private String hotelName;
    @JsonProperty
    private double latitude;
    @JsonProperty
    private double longitude;

    public Map() {
        this.hotelName = "Shady meadows B&B";
        this.latitude = 52.6351204;
        this.longitude = 1.2733774;
    }

}
