package com.automationintesting.unit;

import com.automationintesting.db.BookingDB;
import org.h2.jdbcx.JdbcDataSource;
import org.junit.BeforeClass;

import java.sql.Connection;
import java.sql.SQLException;

public class BaseTest {

    // We need to create a variable of BookingDB for other classes to
    // use once the tests are up and running
    protected static BookingDB bookingDB;

    // To prevent this class from opening multiple DB instances, which
    // would cause the unit checks to fail, we set a boolean to determine
    // whether the DB has been started or not
    private static boolean dbOpen;

    // The @BeforeClass annotation means run whatever code is in
    // this method before running any of the tests. Notice how it
    // is set as static. @BeforeClass annotated methods are always
    // static
    @BeforeClass
    public static void createBookingDb() throws SQLException {
        // First we check if a DB is already open by seeing if
        // dbOpen is set to true. If it's not, create a new BookingDB
        if(!dbOpen){
            bookingDB = new BookingDB();
            dbOpen = true;

            String CREATE_DB = "CREATE table PUBLIC.BOOKINGS ( bookingid int NOT NULL AUTO_INCREMENT, roomid int, firstname varchar(255), lastname varchar(255), depositpaid Boolean, checkin Date, checkout Date, primary key (bookingid));";
            JdbcDataSource ds = new JdbcDataSource();
            ds.setURL("jdbc:h2:mem:rbp");
            ds.setUser("user");
            ds.setPassword("password");

            Connection connection = ds.getConnection();
            connection.prepareStatement(CREATE_DB).executeUpdate();
        }
    }

}
