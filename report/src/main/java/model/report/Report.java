package model.report;

import com.fasterxml.jackson.annotation.JsonProperty;

import java.util.List;

public class Report {

    @JsonProperty
    private List<RoomReport> report;

    public Report(List<RoomReport> report) {
        this.report = report;
    }

    public List<RoomReport> getReport() {
        return report;
    }

    public void setReport(List<RoomReport> report) {
        this.report = report;
    }
}
