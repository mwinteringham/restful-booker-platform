package com.automationintesting.model.db;

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

    @JsonProperty
    private boolean read;

    public MessageSummary(ResultSet resultSet) throws SQLException {
        this.id = resultSet.getInt("messageid");
        this.name = resultSet.getString("name");
        this.subject = resultSet.getString("subject");
        this.read = resultSet.getBoolean("read");
    }

    public MessageSummary(int id, String name, String subject, boolean read) {
        this.id = id;
        this.name = name;
        this.subject = subject;
        this.read = read;
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

    public boolean isRead() {
        return read;
    }

    @Override
    public String toString() {
        return "MessageSummary{" +
                "id=" + id +
                ", name='" + name + '\'' +
                ", subject='" + subject + '\'' +
                ", read='" + read + '\'' +
                '}';
    }
}
