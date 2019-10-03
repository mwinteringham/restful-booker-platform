package com.automationintesting.model.db;

import com.fasterxml.jackson.annotation.JsonProperty;

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

    @Override
    public String toString() {
        return "Messages{" +
                "messages=" + messages.toString() +
                '}';
    }
}
