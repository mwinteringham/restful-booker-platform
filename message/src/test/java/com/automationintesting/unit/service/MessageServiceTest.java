package com.automationintesting.unit.service;

import com.automationintesting.db.MessageDB;
import com.automationintesting.model.db.Count;
import com.automationintesting.model.db.Message;
import com.automationintesting.model.db.MessageSummary;
import com.automationintesting.model.db.Messages;
import com.automationintesting.model.service.MessageResult;
import com.automationintesting.requests.AuthRequests;
import com.automationintesting.service.MessageService;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.MockitoAnnotations;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;

import java.sql.SQLException;
import java.util.ArrayList;
import java.util.List;

import static org.junit.jupiter.api.Assertions.assertEquals;
import static org.mockito.Mockito.doNothing;
import static org.mockito.Mockito.when;

public class MessageServiceTest {

    @Mock
    private MessageDB messageDB;

    @Mock
    private AuthRequests authRequests;

    @Autowired
    @InjectMocks
    private MessageService messageService;

    @BeforeEach
    public void initialiseMocks() {
        MockitoAnnotations.openMocks(this);
    }

    @Test
    public void getMessagesTest() throws SQLException {
        List<MessageSummary> sampleMessages = new ArrayList<>(){{
            this.add(new MessageSummary(1, "Mark", "Message 1", false));
            this.add(new MessageSummary(1, "Richard", "Message 2", false));
        }};

        when(messageDB.queryMessages()).thenReturn(sampleMessages);

        Messages messages = messageService.getMessages();

        assertEquals(messages.toString(), "Messages{messages=[MessageSummary{id=1, name='Mark', subject='Message 1', read='false'}, MessageSummary{id=1, name='Richard', subject='Message 2', read='false'}]}");
    }

    @Test
    public void getCountTest() throws SQLException {
        when(messageDB.getUnreadCount()).thenReturn(10);

        Count count = messageService.getCount();

        assertEquals(count.toString(), "Count{count=10}");
    }

    @Test
    public void getMessageTest() throws SQLException {
        Message sampleMessage = new Message("Mark", "test@email.com", "0189271231", "Test Subject", "Test Description");

        when(messageDB.query(1)).thenReturn(sampleMessage);

        MessageResult messageResult = messageService.getSpecificMessage(1);

        assertEquals(messageResult.getHttpStatus(), HttpStatus.OK);
        assertEquals(messageResult.getMessage().toString(), "Message{messageid=0, name='Mark', email='test@email.com', phone='0189271231', subject='Test Subject', description='Test Description'}");
    }

    @Test
    public void getMessageNotFoundTest() throws SQLException {
        when(messageDB.query(0)).thenReturn(null);

        MessageResult message = messageService.getSpecificMessage(0);

        assertEquals(message.getHttpStatus(), HttpStatus.NOT_FOUND);
    }

    @Test
    public void createMessageTest() throws SQLException {
        Message sampleMessage = new Message("Mark", "test@email.com", "0189271231", "Test Subject", "Test Description");

        when(messageDB.create(sampleMessage)).thenReturn(sampleMessage);

        Message message = messageService.createMessage(sampleMessage);

        assertEquals(message.toString(), "Message{messageid=0, name='Mark', email='test@email.com', phone='0189271231', subject='Test Subject', description='Test Description'}");
    }

    @Test
    public void deleteMessageTest() throws SQLException {
        when(authRequests.postCheckAuth("abc")).thenReturn(true);
        when(messageDB.delete(1)).thenReturn(true);

        MessageResult messageResult = messageService.deleteMessage(1, "abc");

        assertEquals(messageResult.getHttpStatus(), HttpStatus.ACCEPTED);
    }

    @Test
    public void deleteMessageNotFoundTest() throws SQLException {
        when(authRequests.postCheckAuth("abc")).thenReturn(true);
        when(messageDB.delete(1)).thenReturn(false);

        MessageResult messageResult = messageService.deleteMessage(1, "abc");

        assertEquals(messageResult.getHttpStatus(), HttpStatus.NOT_FOUND);
    }

    @Test
    public void deleteMessageNotAuthenticatedTest() throws SQLException {
        when(authRequests.postCheckAuth("abc")).thenReturn(false);

        MessageResult messageResult = messageService.deleteMessage(1, "abc");

        assertEquals(messageResult.getHttpStatus(), HttpStatus.FORBIDDEN);
    }

    @Test
    public void markMessageAsReadTest() throws SQLException {
        when(authRequests.postCheckAuth("abc")).thenReturn(true);
        doNothing().when(messageDB).markAsRead(1);

        HttpStatus messageStatus = messageService.markAsRead(1, "abc");

        assertEquals(messageStatus, HttpStatus.ACCEPTED);
    }

    @Test
    public void markMessageAsReadNotAuthenticated() throws SQLException {
        when(authRequests.postCheckAuth("abc")).thenReturn(false);

        HttpStatus messageStatus = messageService.markAsRead(1, "abc");

        assertEquals(messageStatus, HttpStatus.FORBIDDEN);
    }

}
