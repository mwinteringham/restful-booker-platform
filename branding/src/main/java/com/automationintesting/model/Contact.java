package com.automationintesting.model;

import com.fasterxml.jackson.annotation.JsonProperty;

public class Contact {

    @JsonProperty
    private String name;
    @JsonProperty
    private String address;
    @JsonProperty
    private String phone;
    @JsonProperty
    private String email;

    public Contact() {
        this.name = "Shady Meadows B&B";
        this.address = "The Old Farmhouse, Shady Street, Newfordburyshire, NE1 410S";
        this.phone = "0123456789";
        this.email = "fake@fakeemail.com";
    }

}
