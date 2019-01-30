package com.automationintesting.model;

import com.fasterxml.jackson.annotation.JsonProperty;

public class LogoImpl implements Logo {

    @JsonProperty
    private String url;

    public LogoImpl() {
        this.url = "https://www.mwtestconsultancy.co.uk/img/rbp-logo.png";
    }

    @Override
    public String getUrl() {
        return url;
    }

}
