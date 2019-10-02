package com.automationintesting.db;

import com.automationintesting.model.db.Message;

import java.sql.Connection;
import java.sql.PreparedStatement;
import java.sql.SQLException;

public class InsertSql {

    private PreparedStatement preparedStatement;

    private String name;
    private String email;
    private String phone;
    private String subject;
    private String description;

    InsertSql(Connection connection, Message message) throws SQLException {
        final String CREATE_ROOM = "INSERT INTO PUBLIC.MESSAGES (name, email, phone, subject, description, read) VALUES(?, ?, ?, ?, ?, false);";

        preparedStatement = connection.prepareStatement(CREATE_ROOM);
        preparedStatement.setString(1, message.getName());
        preparedStatement.setString(2, message.getEmail());
        preparedStatement.setString(3, message.getPhone());
        preparedStatement.setString(4, message.getSubject());
        preparedStatement.setString(5, message.getDescription());
    }

    public PreparedStatement getPreparedStatement() {
        return preparedStatement;
    }

}
