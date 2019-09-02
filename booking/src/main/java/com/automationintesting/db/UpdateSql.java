package com.automationintesting.db;

import com.automationintesting.model.Booking;

import java.sql.Connection;
import java.sql.PreparedStatement;
import java.sql.SQLException;
import java.text.SimpleDateFormat;

public class UpdateSql {

    private PreparedStatement preparedStatement;

    UpdateSql(Connection connection, int id, Booking booking) throws SQLException {
        final String UPDATE_SQL = "UPDATE PUBLIC.BOOKINGS SET firstname= ?, lastname = ?, depositpaid = ?, checkin = ?, checkout = ? WHERE bookingid = ?";

        SimpleDateFormat dateFormat = new SimpleDateFormat("yyyy-MM-dd");

        preparedStatement = connection.prepareStatement(UPDATE_SQL);
        preparedStatement.setString(1, booking.getFirstname());
        preparedStatement.setString(2, booking.getLastname());
        preparedStatement.setBoolean(3, booking.isDepositpaid());
        preparedStatement.setString(4, dateFormat.format(booking.getBookingDates().getCheckin()));
        preparedStatement.setString(5, dateFormat.format(booking.getBookingDates().getCheckout()));
        preparedStatement.setInt(6, id);
    }

    public PreparedStatement getPreparedStatement() {
        return preparedStatement;
    }

}
