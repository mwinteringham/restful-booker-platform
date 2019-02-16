package com.automationintesting.model;

import com.fasterxml.jackson.annotation.JsonProperty;

public class MapImpl implements Map {

    @JsonProperty
    private double latitude;
    @JsonProperty
    private double longitude;

    public MapImpl() {
        this.latitude = 52.6351204;
        this.longitude = 1.2733774;
    }

    @Override
    public double getLatitude() {
        return latitude;
    }

    @Override
    public double getLongitude() {
        return longitude;
    }

}
