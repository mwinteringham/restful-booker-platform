package com.automationintesting.unit.db;

import com.automationintesting.db.AuthDB;
import org.junit.jupiter.api.BeforeAll;

import java.io.IOException;
import java.sql.SQLException;

public class BaseTest {

    protected static AuthDB authDB;

    private static boolean dbOpen;

    @BeforeAll
    public static void createRoomDB() throws SQLException, IOException {
        // First we check if a DB is already open by seeing if
        // dbOpen is set to true. If it's not, create a new BookingDB
        if(!dbOpen){
            authDB = new AuthDB();

            dbOpen = true;
        }

        authDB.resetDB();
    }

}
