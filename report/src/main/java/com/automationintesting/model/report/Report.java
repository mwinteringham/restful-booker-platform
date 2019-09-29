package com.automationintesting.model.report;

import com.fasterxml.jackson.annotation.JsonProperty;

import java.util.List;

public class Report {

    @JsonProperty
    private List<Entry> report;

    public Report(List<Entry> report) {
        this.report = report;
    }

    public List<Entry> getReport() {
        return report;
    }

    public void setReport(List<Entry> report) {
        this.report = report;
    }

    @Override
    public String toString() {
        return "Report{" +
                "report=" + report +
                '}';
    }
}
