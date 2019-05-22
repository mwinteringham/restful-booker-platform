package com.automationintesting.unit;

import com.automationintesting.model.Message;
import com.automationintesting.model.MessageSummary;
import com.automationintesting.utils.DatabaseScheduler;
import org.junit.After;
import org.junit.Rule;
import org.junit.Test;
import org.junit.contrib.java.lang.system.EnvironmentVariables;

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

        // Create message database to set
        List<MessageSummary> messages = setupRunAndCountScheduler();

        // Assert the count equals 1
        assertThat(messages.size(), is(1));
    }

    @Test
    public void testRunnerDidntTrashDB() throws SQLException, InterruptedException {
        // Set necessary env var for test
        environmentVariables.set("dbRefresh", "0");

        List<MessageSummary> messages = setupRunAndCountScheduler();

        // Assert the count equals 1
        assertThat(messages.size(), is(3));
    }

    private List<MessageSummary> setupRunAndCountScheduler() throws SQLException, InterruptedException {
        // Create an additional message
        Message message1 = new Message("James",
                "james@dean.com",
                "01821 123321",
                "Just getting a message setup",
                "Lorem ipsum dolores est");

        Message message2 = new Message("Mark",
                "mark@mwtestconsultancy.co.uk",
                "01821 912812",
                "A subject you may be interested in",
                "In posuere accumsan aliquet.");

        messageDB.create(message1);
        messageDB.create(message2);

        // Setup Database scheduler to begin trashing DB and give it a second to reset
        databaseScheduler = new DatabaseScheduler();
        databaseScheduler.startScheduler(messageDB, TimeUnit.SECONDS);

        // Wait for a couple of seconds to allow the runnable to process
        Thread.sleep(1000);

        // Query current message count
        return messageDB.queryMessages();
    }


}
