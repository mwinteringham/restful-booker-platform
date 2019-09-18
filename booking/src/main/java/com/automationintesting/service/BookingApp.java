package com.automationintesting.service;

import com.automationintesting.db.BookingDB;
import com.automationintesting.model.Booking;
import com.automationintesting.model.BookingResult;
import com.automationintesting.model.BookingResults;
import org.h2.jdbc.JdbcSQLNonTransientException;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;

import java.sql.SQLException;
import java.util.List;
import java.util.Optional;

@Service
public class BookingApp {

    @Autowired
    private BookingDB bookingDB;

    public BookingResults getBookings(Optional<String> roomId) throws SQLException {
        List<Booking> bookingList;

        if(roomId.isPresent()){
            bookingList = bookingDB.queryBookingsById(roomId.get());
        } else {
            bookingList = bookingDB.queryAllBookings();
        }

        return new BookingResults(bookingList);
    }

    public BookingResult getIndividualBooking(int bookingId) throws SQLException {
        try {
            Booking booking = bookingDB.query(bookingId);
            return new BookingResult(booking, HttpStatus.OK);
        } catch (JdbcSQLNonTransientException e){
            return new BookingResult(null, HttpStatus.NOT_FOUND);
        }
    }

}
