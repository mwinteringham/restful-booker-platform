package com.automationintesting.model;

import com.fasterxml.jackson.annotation.JsonProperty;

public class Auth {

    @JsonProperty
    private String username;
    @JsonProperty
    private String password;

    public Auth(String username, String password) {
        this.username = username;
        this.password = password;
    }

    public Auth() {
    }

    public String getUsername() {
        return username;
    }

    public String getPassword() {
        return password;
    }

}
