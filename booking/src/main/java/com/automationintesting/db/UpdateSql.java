package com.automationintesting.db;

import com.automationintesting.model.db.Booking;

import java.sql.Connection;
import java.sql.PreparedStatement;
import java.sql.SQLException;

public class UpdateSql {

    private PreparedStatement preparedStatement;

    UpdateSql(Connection connection, int id, Booking booking) throws SQLException {
        final String UPDATE_SQL = "UPDATE PUBLIC.BOOKINGS SET firstname= ?, lastname = ?, depositpaid = ?, checkin = ?, checkout = ? WHERE bookingid = ?";

        preparedStatement = connection.prepareStatement(UPDATE_SQL);
        preparedStatement.setString(1, booking.getFirstname());
        preparedStatement.setString(2, booking.getLastname());
        preparedStatement.setBoolean(3, booking.isDepositpaid());
        preparedStatement.setString(4, booking.getBookingDates().getCheckin().toString());
        preparedStatement.setString(5, booking.getBookingDates().getCheckout().toString());
        preparedStatement.setInt(6, id);
    }

    public PreparedStatement getPreparedStatement() {
        return preparedStatement;
    }

}
