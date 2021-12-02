package com.automationintesting.model;

import org.springframework.http.HttpStatus;

public class Decision {

    private HttpStatus httpStatus;

    private Token token;

    public Decision(HttpStatus httpStatus) {
        this.httpStatus = httpStatus;
    }

    public Decision(HttpStatus httpStatus, Token token) {
        this.httpStatus = httpStatus;
        this.token = token;
    }

    public HttpStatus getStatus() {
        return httpStatus;
    }

    public Token getToken() {
        return token;
    }
}
