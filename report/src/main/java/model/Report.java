package model;

import com.fasterxml.jackson.annotation.JsonProperty;

import java.util.List;

public class Report {

    @JsonProperty
    private int[] rooms;

    @JsonProperty
    private int[] totals;

    public Report() {
    }

    public Report(int[] rooms, int[] totals) {
        this.rooms = rooms;
        this.totals = totals;
    }

    public int[] getRooms() {
        return rooms;
    }

    public void setRooms(int[] rooms) {
        this.rooms = rooms;
    }

    public int[] getTotals() {
        return totals;
    }

    public void setTotals(int[] totals) {
        this.totals = totals;
    }
}
