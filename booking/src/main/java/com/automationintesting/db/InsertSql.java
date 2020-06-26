package com.automationintesting.db;

import com.automationintesting.model.db.Booking;

import java.sql.Connection;
import java.sql.PreparedStatement;
import java.sql.SQLException;

public class InsertSql {

    private PreparedStatement preparedStatement;

    public InsertSql(Connection connection, Booking booking) throws SQLException {
        String INSERT_SQL = "INSERT INTO PUBLIC.BOOKINGS(roomid, firstname, lastname, depositpaid, checkin, checkout) VALUES(?, ?, ?, ?, ?, ?);";

        preparedStatement = connection.prepareStatement(INSERT_SQL);

        preparedStatement.setInt(1, booking.getRoomid());
        preparedStatement.setString(2, booking.getFirstname());
        preparedStatement.setString(3, booking.getLastname());
        preparedStatement.setBoolean(4, booking.isDepositpaid());
        preparedStatement.setString(5, booking.getBookingDates().getCheckin().toString());
        preparedStatement.setString(6, booking.getBookingDates().getCheckout().toString());
    }

    public PreparedStatement getPreparedStatement() {
        return preparedStatement;
    }

}
