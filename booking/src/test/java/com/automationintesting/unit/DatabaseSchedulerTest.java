package com.automationintesting.unit;

import com.automationintesting.model.Booking;
import org.junit.After;
import org.junit.Rule;
import org.junit.Test;
import org.junit.contrib.java.lang.system.EnvironmentVariables;
import com.automationintesting.service.DatabaseScheduler;

import java.sql.SQLException;
import java.util.Date;
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

        // Create booking database to set
        List<Booking> bookings = setupRunAndCountScheduler();

        // Assert the count equals 1
        assertThat(bookings.size(), is(1));
    }

    @Test
    public void testRunnerDidntTrashDB() throws SQLException, InterruptedException {
        // Set necessary env var for test
        environmentVariables.set("dbRefresh", "0");

        List<Booking> bookings = setupRunAndCountScheduler();

        // Assert the count equals 1
        assertThat(bookings.size(), is(3));
    }

    private List<Booking> setupRunAndCountScheduler() throws SQLException, InterruptedException {
        // Create an additional booking
        Booking booking1 = new Booking.BookingBuilder()
                                    .setRoomid(1)
                                    .setFirstname("Mark")
                                    .setLastname("Winteringham")
                                    .setDepositpaid(true)
                                    .setCheckin(new Date())
                                    .setCheckout(new Date())
                                    .build();

        Booking booking2 = new Booking.BookingBuilder()
                                    .setRoomid(1)
                                    .setFirstname("Richard")
                                    .setLastname("Bradshaw")
                                    .setDepositpaid(true)
                                    .setCheckin(new Date())
                                    .setCheckout(new Date())
                                    .build();

        bookingDB.create(booking1);
        bookingDB.create(booking2);

        // Setup Database scheduler to begin trashing DB and give it a second to reset
        databaseScheduler = new DatabaseScheduler();
        databaseScheduler.startScheduler(bookingDB, TimeUnit.SECONDS);

        // Wait for a couple of seconds to allow the runnable to process
        Thread.sleep(1000);

        // Query current booking count
        return bookingDB.queryBookingsById("1");
    }


}
