package com.automationintesting.model.db;

import com.fasterxml.jackson.annotation.JsonProperty;

public class Count {

    @JsonProperty
    private int count;

    public Count(int count) {
        this.count = count;
    }

    public int getCount() {
        return count;
    }

    @Override
    public String toString() {
        return "Count{" +
                "count=" + count +
                '}';
    }
}
