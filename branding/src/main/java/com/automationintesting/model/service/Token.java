package com.automationintesting.model.service;

import com.fasterxml.jackson.annotation.JsonProperty;

public class Token {

    @JsonProperty
    private String token;

    public Token() {
    }

    public Token(String token) {
        this.token = token;
    }

    public String getToken() {
        return token;
    }

    public void setToken(String token) {
        this.token = token;
    }
}
