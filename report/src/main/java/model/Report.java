package model;

import com.fasterxml.jackson.annotation.JsonProperty;

import java.util.List;

public class Report {

    @JsonProperty
    private List<String> rooms;

    @JsonProperty
    private int[] totals;

    public Report() {
    }

    public Report(List<String> rooms, int[] totals) {
        this.rooms = rooms;
        this.totals = totals;
    }

    public List<String> getRooms() {
        return rooms;
    }

    public void setRooms(List<String> rooms) {
        this.rooms = rooms;
    }

    public int[] getTotals() {
        return totals;
    }

    public void setTotals(int[] totals) {
        this.totals = totals;
    }
}
