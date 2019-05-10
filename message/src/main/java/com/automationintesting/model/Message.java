package com.automationintesting.model;

import com.fasterxml.jackson.annotation.JsonProperty;

import java.sql.ResultSet;
import java.sql.SQLException;

public class Message {

    @JsonProperty
    private int messageid;

    @JsonProperty
    private String name;

    @JsonProperty
    private String email;

    @JsonProperty
    private String phone;

    @JsonProperty
    private String subject;

    @JsonProperty
    private String description;

    public Message() {
    }

    public Message(String name, String email, String phone, String subject, String description) {
        this.name = name;
        this.email = email;
        this.phone = phone;
        this.subject = subject;
        this.description = description;
    }

    public Message(ResultSet result) throws SQLException {
        this.messageid = result.getInt("messageid");
        this.name = result.getString("name");
        this.email = result.getString("email");
        this.phone = result.getString("phone");
        this.subject = result.getString("subject");
        this.description = result.getString("description");
    }

    public int getMessageid() {
        return messageid;
    }

    public String getName() {
        return name;
    }

    public String getEmail() {
        return email;
    }

    public String getPhone() {
        return phone;
    }

    public String getSubject() {
        return subject;
    }

    public String getDescription() {
        return description;
    }

    public void setMessageid(int messageid) {
        this.messageid = messageid;
    }

    public void setName(String name) {
        this.name = name;
    }

    public void setEmail(String email) {
        this.email = email;
    }

    public void setPhone(String phone) {
        this.phone = phone;
    }

    public void setSubject(String subject) {
        this.subject = subject;
    }

    public void setDescription(String description) {
        this.description = description;
    }

    @Override
    public String toString() {
        return "Message{" +
                "messageid=" + messageid +
                ", name='" + name + '\'' +
                ", email='" + email + '\'' +
                ", phone='" + phone + '\'' +
                ", subject='" + subject + '\'' +
                ", description='" + description + '\'' +
                '}';
    }
}
