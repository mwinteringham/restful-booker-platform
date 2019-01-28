package com.automationintesting.model;

import com.fasterxml.jackson.annotation.JsonProperty;

public class Logo {

    @JsonProperty
    private String url;

    public Logo() {
        this.url = "https://www.mwtestconsultancy.co.uk/img/rbp-logo.png";
    }

}
