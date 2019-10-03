package com.automationintesting.db;

import com.automationintesting.model.db.Room;

import java.sql.Array;
import java.sql.Connection;
import java.sql.PreparedStatement;
import java.sql.SQLException;

public class UpdateSql {

    private PreparedStatement preparedStatement;

    UpdateSql(Connection connection, int id, Room room) throws SQLException {
        String UPDATE_ROOM = "UPDATE PUBLIC.ROOMS SET room_number = ?, type = ?, accessible = ?, image = ?, description = ?, features = ?, roomPrice = ? WHERE roomid = ?";

        preparedStatement = connection.prepareStatement(UPDATE_ROOM);
        preparedStatement.setInt(1, room.getRoomNumber());
        preparedStatement.setString(2, room.getType());
        preparedStatement.setBoolean(3, room.isAccessible());
        preparedStatement.setString(4, room.getImage());
        preparedStatement.setString(5, room.getDescription());

        Array featuresArray = connection.createArrayOf("VARCHAR", room.getFeatures());
        preparedStatement.setArray(6, featuresArray);

        preparedStatement.setInt(7, room.getRoomPrice());
        preparedStatement.setInt(8, id);
    }

    public PreparedStatement getPreparedStatement() {
        return preparedStatement;
    }

}
