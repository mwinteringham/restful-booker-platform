package com.automationintesting.model;

import com.fasterxml.jackson.annotation.JsonProperty;

import java.sql.ResultSet;
import java.sql.SQLException;

public class Contact {

    @JsonProperty
    private String name;
    @JsonProperty
    private String address;
    @JsonProperty
    private String phone;
    @JsonProperty
    private String email;

    public Contact(String name, String address, String phone, String email) {
        this.name = name;
        this.address = address;
        this.phone = phone;
        this.email = email;
    }

    public Contact(ResultSet result) throws SQLException {
        this.name = result.getString("contact_name");
        this.address = result.getString("address");
        this.phone = result.getString("phone");
        this.email = result.getString("email");
    }

    public Contact() {}

    public String getName() {
        return name;
    }

    public String getAddress() {
        return address;
    }

    public String getPhone() {
        return phone;
    }

    public String getEmail() {
        return email;
    }

    public void setName(String name) {
        this.name = name;
    }

    public void setAddress(String address) {
        this.address = address;
    }

    public void setPhone(String phone) {
        this.phone = phone;
    }

    public void setEmail(String email) {
        this.email = email;
    }
}
