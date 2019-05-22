package com.automationintesting.model;

import com.fasterxml.jackson.annotation.JsonProperty;

import java.util.ArrayList;
import java.util.List;

public class Messages {

    @JsonProperty
    private List<MessageSummary> messages;

    public Messages(List<MessageSummary> messages) {
        this.messages = messages;
    }

    public List<MessageSummary> getMessages() {
        return messages;
    }

}
