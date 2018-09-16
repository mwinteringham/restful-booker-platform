package com.automationintesting.unit;

import model.Room;
import org.junit.After;
import org.junit.Rule;
import org.junit.Test;
import org.junit.contrib.java.lang.system.EnvironmentVariables;
import utils.DatabaseScheduler;

import java.sql.SQLException;
import java.util.List;
import java.util.concurrent.TimeUnit;

import static org.hamcrest.CoreMatchers.is;
import static org.junit.Assert.assertThat;

public class DatabaseSchedulerTest extends BaseTest {

    private DatabaseScheduler databaseScheduler;

    @Rule
    public final EnvironmentVariables environmentVariables
            = new EnvironmentVariables();

    @After
    public void stopDatabaseScheduler(){
        databaseScheduler.stepScheduler();
    }

    @Test
    public void testSetEnvVar(){
        environmentVariables.set("dbRefresh", "5");

        databaseScheduler = new DatabaseScheduler();
        int resetCount = databaseScheduler.getResetCount();

        assertThat(resetCount, is(5));
    }

    @Test
    public void testEmptyEnvVar(){
        databaseScheduler = new DatabaseScheduler();
        int resetCount = databaseScheduler.getResetCount();

        assertThat(resetCount, is(0));
    }

    @Test
    public void testRunnerTrashedDB() throws SQLException, InterruptedException {
        // Set necessary env var for test
        environmentVariables.set("dbRefresh", "10");

        // Create room database to set
        List<Room> rooms = setupRunAndCountScheduler();

        // Assert the count equals 1
        assertThat(rooms.size(), is(1));
    }

    @Test
    public void testRunnerDidntTrashDB() throws SQLException, InterruptedException {
        // Set necessary env var for test
        environmentVariables.set("dbRefresh", "0");

        List<Room> rooms = setupRunAndCountScheduler();

        // Assert the count equals 1
        assertThat(rooms.size(), is(3));
    }

    private List<Room> setupRunAndCountScheduler() throws SQLException, InterruptedException {
        // Create an additional room
        Room room1 = new Room(101, "Single", 2, true, "Wifi");
        Room room2 = new Room(102, "Single", 2, true, "Wifi");
        roomDB.create(room1);
        roomDB.create(room2);

        // Setup Database scheduler to begin trashing DB and give it a second to reset
        databaseScheduler = new DatabaseScheduler();
        databaseScheduler.startScheduler(roomDB, TimeUnit.SECONDS);

        // Wait for a couple of seconds to allow the runnable to process
        Thread.sleep(1000);

        // Query current room count
        return roomDB.queryRooms();
    }


}
