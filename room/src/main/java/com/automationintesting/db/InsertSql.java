package com.automationintesting.db;

import com.automationintesting.model.db.Room;

import java.sql.Array;
import java.sql.Connection;
import java.sql.PreparedStatement;
import java.sql.SQLException;

public class InsertSql {

    private PreparedStatement preparedStatement;

    private int roomNumber;
    private String type;
    private int beds;
    private boolean accessible;
    private String image;
    private String description;
    private String[] features;

    InsertSql(Connection connection, Room room) throws SQLException {
        final String CREATE_ROOM = "INSERT INTO PUBLIC.ROOMS (room_number, type, accessible, image, description, features, roomPrice) VALUES(?, ?, ?, ?, ?, ?, ?);";

        preparedStatement = connection.prepareStatement(CREATE_ROOM);
        preparedStatement.setInt(1, room.getRoomNumber());
        preparedStatement.setString(2, room.getType());
        preparedStatement.setBoolean(3, room.isAccessible());
        preparedStatement.setString(4, room.getImage());
        preparedStatement.setString(5, room.getDescription());

        Array featuresArray = connection.createArrayOf("VARCHAR", room.getFeatures());
        preparedStatement.setArray(6, featuresArray);

        preparedStatement.setInt(7, room.getRoomPrice());
    }

    public PreparedStatement getPreparedStatement() {
        return preparedStatement;
    }
}
