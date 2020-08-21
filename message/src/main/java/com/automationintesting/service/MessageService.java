package com.automationintesting.service;

import com.automationintesting.db.MessageDB;
import com.automationintesting.model.db.Count;
import com.automationintesting.model.db.Message;
import com.automationintesting.model.db.Messages;
import com.automationintesting.model.service.MessageResult;
import com.automationintesting.requests.AuthRequests;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.context.event.ApplicationReadyEvent;
import org.springframework.context.event.EventListener;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;

import java.sql.SQLException;
import java.util.concurrent.TimeUnit;

@Service
public class MessageService {

    @Autowired
    private MessageDB messageDB;

    private AuthRequests authRequest;

    public MessageService() {
        authRequest = new AuthRequests();
    }

    @EventListener(ApplicationReadyEvent.class)
    public void beginDbScheduler() {
        DatabaseScheduler databaseScheduler = new DatabaseScheduler();
        databaseScheduler.startScheduler(messageDB, TimeUnit.MINUTES);
    }

    public Messages getMessages() throws SQLException {
        return new Messages(messageDB.queryMessages());
    }

    public Count getCount() throws SQLException {
        Count count = new Count(messageDB.getUnreadCount());

        return count;
    }

    public MessageResult getSpecificMessage(int messageId) throws SQLException {
        Message queriedMessage = messageDB.query(messageId);

        if(queriedMessage != null){
            return new MessageResult(HttpStatus.OK, queriedMessage);
        } else {
            return new MessageResult(HttpStatus.NOT_FOUND);
        }
    }

    public Message createMessage(Message messageToCreate) throws SQLException {
        Message createdMessage = messageDB.create(messageToCreate);

        return createdMessage;
    }

    public MessageResult deleteMessage(int messageId, String token) throws SQLException {
        if(authRequest.postCheckAuth(token)){
            if(messageDB.delete(messageId)){
                return new MessageResult(HttpStatus.ACCEPTED);
            } else {
                return new MessageResult(HttpStatus.NOT_FOUND);
            }
        } else {
            return new MessageResult(HttpStatus.FORBIDDEN);
        }
    }

    public HttpStatus markAsRead(int messageId, String token) throws SQLException {
        if(authRequest.postCheckAuth(token)){
            messageDB.markAsRead(messageId);

            return HttpStatus.ACCEPTED;
        } else {
            return HttpStatus.FORBIDDEN;
        }
    }
}
