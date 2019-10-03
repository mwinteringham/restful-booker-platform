package com.automationintesting.model.db;

import com.fasterxml.jackson.annotation.JsonProperty;

import javax.persistence.Entity;
import javax.validation.constraints.NotBlank;
import javax.validation.constraints.NotNull;
import java.sql.ResultSet;
import java.sql.SQLException;

@Entity
public class Map {

    @JsonProperty
    @NotNull(message = "Latitude should not be null")
    private double latitude;
    @JsonProperty
    @NotNull(message = "Longitude should not be null")
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

    @Override
    public String toString() {
        return "Map{" +
                "latitude=" + latitude +
                ", longitude=" + longitude +
                '}';
    }
}
