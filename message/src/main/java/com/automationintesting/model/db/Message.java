package com.automationintesting.model.db;

import com.fasterxml.jackson.annotation.JsonProperty;

import javax.persistence.Entity;
import javax.validation.constraints.*;
import java.sql.ResultSet;
import java.sql.SQLException;

@Entity
public class Message {

    @JsonProperty
    private int messageid;

    @JsonProperty
    @NotNull(message = "Name must be set")
    @NotBlank (message = "Name may not be blank")
    private String name;

    @JsonProperty
    @Email
    @NotNull(message = "Email must be set")
    @NotBlank(message = "Email may not be blank")
    private String email;

    @JsonProperty
    @Size(min = 11, max = 21, message = "Phone must be between 11 and 21 characters.")
    @NotNull(message = "Phone must be set")
    @NotBlank(message = "Phone may not be blank")
    private String phone;

    @JsonProperty
    @Size(min = 5, max = 100, message = "Subject must be between 5 and 100 characters.")
    @NotNull(message = "Subject must be set")
    @NotBlank(message = "Subject may not be blank")
    private String subject;

    @JsonProperty
    @Size(min = 20, max = 2000, message = "Message must be between 20 and 2000 characters.")
    @NotNull(message = "Message must be set")
    @NotBlank(message = "Message may not be blank")
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
