package model.report;

import com.fasterxml.jackson.annotation.JsonProperty;

import java.util.List;

public class RoomReport {

    @JsonProperty
    private String room;

    @JsonProperty
    private List<RoomReportDate> values;

    public RoomReport(String room, List<RoomReportDate> values) {
        this.room = room;
        this.values = values;
    }

    public String getRoom() {
        return room;
    }

    public void setRoom(String room) {
        this.room = room;
    }

    public List<RoomReportDate> getValues() {
        return values;
    }

    public void setValues(List<RoomReportDate> values) {
        this.values = values;
    }
}
