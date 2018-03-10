package model;

import com.fasterxml.jackson.annotation.JsonProperty;

import java.util.List;

public class Report {

    @JsonProperty
    private List<String> hotels;

    @JsonProperty
    private int[] totals;

    public Report() {
    }

    public Report(List<String> hotels, int[] totals) {
        this.hotels = hotels;
        this.totals = totals;
    }

    public List<String> getHotels() {
        return hotels;
    }

    public void setHotels(List<String> hotels) {
        this.hotels = hotels;
    }

    public int[] getTotals() {
        return totals;
    }

    public void setTotals(int[] totals) {
        this.totals = totals;
    }
}
