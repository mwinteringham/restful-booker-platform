package com.automationintesting.unit;

import db.RoomDB;
import org.junit.BeforeClass;

import java.sql.SQLException;

public class BaseTest {

    // We need to create a variable of RoomDB for other classes to
    // use once the tests are up and running
    protected static RoomDB roomDB;

    // To prevent this class from opening multiple DB instances, which
    // would cause the unit checks to fail, we set a boolean to determine
    // whether the DB has been started or not
    private static boolean dbOpen;

    // The @BeforeClass annotation means run whatever code is in
    // this method before running any of the tests. Notice how it
    // is set as static. @BeforeClass annotated methods are always
    // static
    @BeforeClass
    public static void createRoomDB() throws SQLException {
        // First we check if a DB is already open by seeing if
        // dbOpen is set to true. If it's not, create a new BookingDB
        if(!dbOpen){
            roomDB = new RoomDB();
            dbOpen = true;
        }

    }

}
