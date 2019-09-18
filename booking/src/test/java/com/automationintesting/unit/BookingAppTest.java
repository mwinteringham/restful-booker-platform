package com.automationintesting.unit;

import com.automationintesting.api.BookingApplication;
import com.automationintesting.service.BookingApp;
import com.automationintesting.db.InsertSql;
import com.automationintesting.model.*;
import liquibase.Contexts;
import liquibase.Liquibase;
import liquibase.database.jvm.JdbcConnection;
import liquibase.exception.LiquibaseException;
import liquibase.resource.ClassLoaderResourceAccessor;
import liquibase.resource.ResourceAccessor;
import org.h2.jdbcx.JdbcDataSource;
import org.junit.After;
import org.junit.Before;
import org.junit.Test;
import org.junit.runner.RunWith;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.http.HttpStatus;
import org.springframework.test.context.junit4.SpringRunner;

import java.sql.Connection;
import java.sql.PreparedStatement;
import java.sql.SQLException;
import java.util.Date;
import java.util.Optional;

import static org.hamcrest.CoreMatchers.*;
import static org.junit.Assert.assertThat;

@RunWith(SpringRunner.class)
@SpringBootTest(classes = BookingApplication.class)
public class BookingAppTest{

    private Connection connection;

    @Autowired
    private BookingApp bookingApp;

    @Before
    public void createAdditionalBookings() throws SQLException {
        JdbcDataSource ds = new JdbcDataSource();
        ds.setURL("jdbc:h2:mem:rbp");
        ds.setUser("user");
        ds.setPassword("password");
        connection = ds.getConnection();

        BookingDates bookingDates = new BookingDates(new Date(), new Date());
        Booking booking = new Booking(2, 2, "Mark", "Dean", true, bookingDates);

        InsertSql insertSql = new InsertSql(connection, booking);

        PreparedStatement createPs = insertSql.getPreparedStatement();

        createPs.executeUpdate();
    }

    @Test
    public void returnAllBookingsTest() throws SQLException {
        Optional<String> emptyOptional = Optional.empty();

        BookingResults bookingResults = bookingApp.getBookings(emptyOptional);

        assertThat(bookingResults.getBookings().size(), is(2));
    }

    @Test
    public void returnBookingsByRoomIdTest() throws SQLException {
        Optional<String> roomid = Optional.of("2");

        BookingResults bookingResults = bookingApp.getBookings(roomid);

        assertThat(bookingResults.getBookings().size(), is(1));
    }

    @Test
    public void returnSpecificBookingTest() throws SQLException {
        BookingResult bookingResult = bookingApp.getIndividualBooking(1);

        assertThat(bookingResult.getStatus(), is(HttpStatus.OK));
        assertThat(bookingResult.getBooking().toString(), is("Booking{roomid=1, firstname='James', lastname='Dean', depositpaid=true, bookingDates=BookingDates{checkin=2019-01-01, checkout=2019-01-05}}"));
    }

    @Test
    public void returnBookingNotFound() throws SQLException {
        BookingResult bookingResult = bookingApp.getIndividualBooking(100);

        assertThat(bookingResult.getStatus(), is(HttpStatus.NOT_FOUND));
        assertThat(bookingResult.getBooking(), is(nullValue()));
    }

    @After
    public void resetDB() throws LiquibaseException {
        JdbcConnection jdbcConnection = new JdbcConnection(connection);
        ResourceAccessor resourceAccessor = new ClassLoaderResourceAccessor();

        Liquibase liquibase = new Liquibase("db/changelog/db.changelog-master.yaml", resourceAccessor, jdbcConnection);

        liquibase.dropAll();

        liquibase.update(new Contexts());
    }
}
