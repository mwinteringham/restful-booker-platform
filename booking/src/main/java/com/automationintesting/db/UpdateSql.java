package com.automationintesting.db;

import com.automationintesting.model.Booking;

import java.sql.Connection;
import java.sql.PreparedStatement;
import java.sql.SQLException;
import java.text.SimpleDateFormat;

public class UpdateSql {

    private PreparedStatement preparedStatement;

    UpdateSql(Connection connection, int id, Booking booking) throws SQLException {
        final String UPDATE_SQL = "UPDATE BOOKINGS SET firstname= ?, lastname = ?, totalprice = ?, depositpaid = ?, checkin = ?, checkout = ? WHERE bookingid = ?";

        SimpleDateFormat dateFormat = new SimpleDateFormat("yyyy-MM-dd");

        preparedStatement = connection.prepareStatement(UPDATE_SQL);
        preparedStatement.setString(1, booking.getFirstname());
        preparedStatement.setString(2, booking.getLastname());
        preparedStatement.setInt(3, booking.getTotalprice());
        preparedStatement.setBoolean(4, booking.isDepositpaid());
        preparedStatement.setString(5, dateFormat.format(booking.getBookingDates().getCheckin()));
        preparedStatement.setString(6, dateFormat.format(booking.getBookingDates().getCheckout()));
        preparedStatement.setInt(7, id);
    }

    public PreparedStatement getPreparedStatement() {
        return preparedStatement;
    }

}
