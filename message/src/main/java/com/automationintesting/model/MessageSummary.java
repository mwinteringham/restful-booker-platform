package com.automationintesting.model;

import com.fasterxml.jackson.annotation.JsonProperty;

import java.sql.ResultSet;
import java.sql.SQLException;

public class MessageSummary {

    @JsonProperty
    private int id;

    @JsonProperty
    private String name;

    @JsonProperty
    private String subject;

    public MessageSummary(ResultSet resultSet) throws SQLException {
        this.id = resultSet.getInt("messageid");
        this.name = resultSet.getString("name");
        this.subject = resultSet.getString("subject");
    }

    public int getId() {
        return id;
    }

    public String getName() {
        return name;
    }

    public String getSubject() {
        return subject;
    }

    @Override
    public String toString() {
        return "MessageSummary{" +
                "id=" + id +
                ", name='" + name + '\'' +
                ", subject='" + subject + '\'' +
                '}';
    }
}
