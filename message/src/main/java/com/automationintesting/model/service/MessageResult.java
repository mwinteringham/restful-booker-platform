package com.automationintesting.model.service;

import com.automationintesting.model.db.Message;
import org.springframework.http.HttpStatus;

public class MessageResult {

    private HttpStatus httpStatus;

    private Message message;

    public MessageResult(HttpStatus httpStatus, Message message) {
        this.httpStatus = httpStatus;
        this.message = message;
    }

    public MessageResult(HttpStatus httpStatus) {
        this.httpStatus = httpStatus;
    }

    public HttpStatus getHttpStatus() {
        return httpStatus;
    }

    public Message getMessage() {
        return message;
    }
}
