package com.automationintesting.model;

import com.fasterxml.jackson.annotation.JsonProperty;

public class ContactImpl implements Contact {

    @JsonProperty
    private String name;
    @JsonProperty
    private String address;
    @JsonProperty
    private String phone;
    @JsonProperty
    private String email;

    public ContactImpl() {
        this.name = "Shady Meadows B&B";
        this.address = "The Old Farmhouse, Shady Street, Newfordburyshire, NE1 410S";
        this.phone = "0123456789";
        this.email = "fake@fakeemail.com";
    }

    @Override
    public String getName() {
        return name;
    }

    @Override
    public String getAddress() {
        return address;
    }

    @Override
    public String getPhone() {
        return phone;
    }

    @Override
    public String getEmail() {
        return email;
    }

}
