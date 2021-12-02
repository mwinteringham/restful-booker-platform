package com.automationintesting.model;

import com.automationintesting.service.RandomString;

import java.sql.Connection;
import java.sql.PreparedStatement;
import java.sql.SQLException;
import java.util.Calendar;
import java.sql.Date;
import java.util.concurrent.ThreadLocalRandom;

public class Token {

    private String token;
    private Date expiry;

    public Token() {
        this.token = new RandomString(16, ThreadLocalRandom.current()).nextString();
        this.expiry = createExpiryTimestamp();
    }

    public Token(String token) {
        this.token = token;

        expiry = createExpiryTimestamp();
    }

    public Token(String token, Date expiry){
        this.token = token;
        this.expiry = expiry;
    }

    public String getToken() {
        return token;
    }

    public void setToken(String token) {
        this.token = token;
    }

    public PreparedStatement getPreparedStatement(Connection connection) throws SQLException {
        final String CREATE_TOKEN = "INSERT INTO PUBLIC.TOKENS (token, expiry) VALUES(?, ?);";

        PreparedStatement preparedStatement = connection.prepareStatement(CREATE_TOKEN);
        preparedStatement.setString(1, token);
        preparedStatement.setDate(2, expiry);

        return preparedStatement;
    }

    private Date createExpiryTimestamp() {
        Calendar cal = Calendar.getInstance();
        cal.setTime(new java.util.Date());
        cal.add(Calendar.HOUR_OF_DAY, 1);
        return new Date(cal.getTime().getTime());
    }
}
