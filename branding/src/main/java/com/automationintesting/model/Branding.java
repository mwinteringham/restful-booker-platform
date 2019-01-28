package com.automationintesting.model;

import com.fasterxml.jackson.annotation.JsonProperty;

public class Branding {

    @JsonProperty
    private Map map;
    @JsonProperty
    private Logo logo;
    @JsonProperty
    private String description;
    @JsonProperty
    private Contact contact;

    public Branding() {
        this.map = new Map();
        this.logo = new Logo();
        this.description = "Welcome to Shady Meadows, a delightful Bed & Breakfast nestled in the hills on Newingtonfordburyshire. A place so beautiful you will never want to leave. All our rooms have comfortable beds and we provide breakfast from the locally sourced supermarket. It is a delightful place.";
        this.contact = new Contact();
    }

}
