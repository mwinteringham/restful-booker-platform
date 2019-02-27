package com.automationintesting.model;

import com.fasterxml.jackson.annotation.JsonProperty;

import java.sql.ResultSet;
import java.sql.SQLException;

public class Map {

    @JsonProperty
    private double latitude;
    @JsonProperty
    private double longitude;

    public Map() {}

    public Map(double latitude, double longitude) {
        this.latitude = latitude;
        this.longitude = longitude;
    }

    public Map(ResultSet result) throws SQLException {
        this.latitude = result.getDouble("latitude");
        this.longitude = result.getDouble("longitude");
    }

    public double getLatitude() {
        return latitude;
    }

    public double getLongitude() {
        return longitude;
    }

    public void setLatitude(double latitude) {
        this.latitude = latitude;
    }

    public void setLongitude(double longitude) {
        this.longitude = longitude;
    }
}
