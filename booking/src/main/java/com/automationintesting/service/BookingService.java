package com.automationintesting.service;

import com.automationintesting.db.BookingDB;
import com.automationintesting.model.db.*;
import com.automationintesting.model.service.BookingResult;
import com.automationintesting.requests.AuthRequests;
import com.automationintesting.requests.MessageRequests;
import org.h2.jdbc.JdbcSQLNonTransientException;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.context.event.ApplicationReadyEvent;
import org.springframework.context.event.EventListener;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;

import java.sql.SQLException;
import java.util.List;
import java.util.Optional;
import java.util.concurrent.TimeUnit;

@Service
public class BookingService {

    @Autowired
    private BookingDB bookingDB;
    private AuthRequests authRequests;
    private DateCheckValidator dateCheckValidator;
    private MessageRequests messageRequests;

    public BookingService() {
        authRequests = new AuthRequests();
        dateCheckValidator = new DateCheckValidator();
        messageRequests = new MessageRequests();
    }

    @EventListener(ApplicationReadyEvent.class)
    public void beginDbScheduler() {
        DatabaseScheduler databaseScheduler = new DatabaseScheduler();
        databaseScheduler.startScheduler(bookingDB, TimeUnit.MINUTES);
    }

    public BookingResult getBookings(Optional<String> roomId, String token) throws SQLException {
        if(authRequests.postCheckAuth(token)){
            List<Booking> bookingList;

            if(roomId.isPresent()){
                bookingList = bookingDB.queryBookingsById(roomId.get());
            } else {
                bookingList = bookingDB.queryAllBookings();
            }

            return new BookingResult(new Bookings(bookingList), HttpStatus.OK);
        } else {
            return new BookingResult(HttpStatus.FORBIDDEN);
        }
    }

    public BookingResult getIndividualBooking(int bookingId, String token) throws SQLException {
        if(authRequests.postCheckAuth(token)){
            try {
                Booking booking = bookingDB.query(bookingId);
                return new BookingResult(booking, HttpStatus.OK);
            } catch (JdbcSQLNonTransientException e){
                return new BookingResult(HttpStatus.NOT_FOUND);
            }
        } else {
            return new BookingResult(HttpStatus.FORBIDDEN);
        }
    }

    public HttpStatus deleteBooking(int bookingid, String token) throws SQLException {
        if(authRequests.postCheckAuth(token)){
            if(bookingDB.delete(bookingid)){
                return HttpStatus.ACCEPTED;
            } else {
                return HttpStatus.NOT_FOUND;
            }
        } else {
            return HttpStatus.FORBIDDEN;
        }
    }

    public BookingResult updateBooking(int bookingId, Booking bookingToUpdate, String token) throws SQLException {
        if(authRequests.postCheckAuth(token)){
            if(dateCheckValidator.isValid(bookingToUpdate.getBookingDates())) {
                if (bookingDB.checkForBookingConflict(bookingToUpdate)) {
                    return new BookingResult(HttpStatus.CONFLICT);
                } else {
                    CreatedBooking updatedBooking = bookingDB.update(bookingId, bookingToUpdate);

                    if(updatedBooking != null){
                        return new BookingResult(updatedBooking,  HttpStatus.OK);
                    } else {
                        return new BookingResult(HttpStatus.NOT_FOUND);
                    }
                }
            } else {
                return new BookingResult(HttpStatus.CONFLICT);
            }
        } else {
            return new BookingResult(HttpStatus.FORBIDDEN);
        }
    }

    public BookingResult createBooking(Booking bookingToCreate) throws SQLException {
        if(dateCheckValidator.isValid(bookingToCreate.getBookingDates())) {
            if (bookingDB.checkForBookingConflict(bookingToCreate)) {
                return new BookingResult(HttpStatus.CONFLICT);
            } else {
                CreatedBooking createdBooking = bookingDB.create(bookingToCreate);

                if(bookingToCreate.getEmail() != null && bookingToCreate.getPhone() != null){
                    MessageBuilder messageBuilder = new MessageBuilder();
                    Message message = messageBuilder.build(bookingToCreate);

                    messageRequests.postMessage(message);
                }

                return new BookingResult(createdBooking, HttpStatus.CREATED);
            }
        } else {
            return new BookingResult(HttpStatus.CONFLICT);
        }
    }

    public BookingSummaries getBookingSummaries(String roomId) throws SQLException {
        List<BookingSummary> bookingList;

        bookingList = bookingDB.queryBookingSummariesById(roomId);

        return new BookingSummaries(bookingList);
    }
}
