package com.automationintesting.unit;

import com.automationintesting.model.Message;
import com.automationintesting.model.MessageSummary;
import liquibase.exception.LiquibaseException;
import org.junit.Before;
import org.junit.Test;

import java.sql.SQLException;
import java.util.List;

import static org.hamcrest.CoreMatchers.is;
import static org.hamcrest.MatcherAssert.assertThat;
import static org.junit.Assert.assertEquals;

public class MessageDBTest extends BaseTest {

    private int currentMessageId;

    @Before
    public void resetDB() throws SQLException, LiquibaseException {
        messageDB.resetDB();

        Message message = new Message("James",
                "james@dean.com",
                "01821 123321",
                "Just getting a message setup",
                "Lorem ipsum dolores est");

        Message createdMessage = messageDB.create(message);

        currentMessageId = createdMessage.getMessageid();
    }

    @Test
    public void testQueryMessage() throws SQLException {
        Message queriedMessage = messageDB.query(currentMessageId);

        String queriedMessageString = queriedMessage.toString();

        assertEquals("Message{messageid=" + currentMessageId + ", name='James', email='james@dean.com', phone='01821 123321', subject='Just getting a message setup', description='Lorem ipsum dolores est'}", queriedMessageString);
    }

    @Test
    public void testCreateMessage() throws SQLException {
        Message message = new Message("Mark",
                "mark@mwtestconsultancy.co.uk",
                "01821 912812",
                "A subject you may be interested in",
                "In posuere accumsan aliquet.");

        Message createdMessage = messageDB.create(message);

        String createdMessageString = createdMessage.toString();

        assertEquals("Message{messageid=" + (currentMessageId  + 1) + ", name='Mark', email='mark@mwtestconsultancy.co.uk', phone='01821 912812', subject='A subject you may be interested in', description='In posuere accumsan aliquet.'}", createdMessageString);
    }

    @Test
    public void testDeleteMessage() throws SQLException {
        boolean isDeleted = messageDB.delete(currentMessageId);

        assertThat(isDeleted, is(true));
    }

    @Test
    public void testGetMessages() throws SQLException {
        Message message = new Message("Mark",
                "mark@mwtestconsultancy.co.uk",
                "01821 912812",
                "A subject you may be interested in",
                "In posuere accumsan aliquet.");

        messageDB.create(message);

        List<MessageSummary> messageSummaries = messageDB.queryMessages();

        assertEquals("[MessageSummary{id=1, name='James Dean', subject='Booking enquiry'}, MessageSummary{id=2, name='James', subject='Just getting a message setup'}, MessageSummary{id=3, name='Mark', subject='A subject you may be interested in'}]", messageSummaries.toString());
    }

    @Test
    public void testReadCount() throws SQLException {
        int currentMessageCount = messageDB.getUnreadCount();

        assertThat(currentMessageCount, is(2));
    }

    @Test
    public void testMarkAsRead() throws SQLException {
        int beforeReadCount = messageDB.getUnreadCount();

        messageDB.markAsRead(currentMessageId);

        int afterReadCount = messageDB.getUnreadCount();

        assertThat(afterReadCount, is(beforeReadCount - 1));
    }

}
