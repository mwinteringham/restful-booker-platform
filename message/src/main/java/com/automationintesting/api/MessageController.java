package com.automationintesting.api;

import com.automationintesting.model.db.Count;
import com.automationintesting.model.db.Message;
import com.automationintesting.model.db.Messages;
import com.automationintesting.model.service.MessageResult;
import com.automationintesting.service.MessageService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import javax.validation.Valid;
import java.sql.SQLException;

@RestController
public class MessageController {

    @Autowired
    private MessageService messageService;

    @RequestMapping(value = "/", method = RequestMethod.GET)
    public ResponseEntity<Messages> getMessages() throws SQLException {
        Messages messages = messageService.getMessages();

        return ResponseEntity.status(HttpStatus.OK).body(messages);
    }

    @RequestMapping(value = "/count", method = RequestMethod.GET)
    public ResponseEntity<Count> getCount() throws SQLException {
        Count count = messageService.getCount();

        return ResponseEntity.status(HttpStatus.OK).body(count);
    }

    @RequestMapping(value = "/{id:[0-9]*}", method = RequestMethod.GET)
    public ResponseEntity getMessage(@PathVariable(value = "id") int messageId) throws SQLException {
        MessageResult messageResult = messageService.getSpecificMessage(messageId);

        return ResponseEntity.status(messageResult.getHttpStatus()).body(messageResult.getMessage());
    }

    @RequestMapping(value = "/", method = RequestMethod.POST)
    public ResponseEntity<Message> createMessage(@Valid @RequestBody Message message) throws SQLException {
        Message createdMessage = messageService.createMessage(message);

        return ResponseEntity.status(HttpStatus.CREATED).body(createdMessage);
    }

    @RequestMapping(value = "/{id:[0-9]*}", method = RequestMethod.DELETE)
    public ResponseEntity deleteMessage(@PathVariable(value = "id") int messageId, @CookieValue(value ="token", required = false) String token) throws SQLException {
        MessageResult messageResult = messageService.deleteMessage(messageId, token);

        return ResponseEntity.status(messageResult.getHttpStatus()).build();
    }

    @RequestMapping(value = "/{id:[0-9]*}/read", method = RequestMethod.PUT)
    public ResponseEntity markAsRead(@PathVariable(value = "id") int messageId, @CookieValue(value ="token", required = false) String token) throws SQLException {
        HttpStatus messageStatus = messageService.markAsRead(messageId, token);

        return ResponseEntity.status(messageStatus).build();
    }
}
