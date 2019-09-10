package com.automationintesting.api;

import com.automationintesting.db.MessageDB;
import com.automationintesting.model.Count;
import com.automationintesting.model.Message;
import com.automationintesting.model.Messages;
import com.automationintesting.requests.AuthRequests;
import com.automationintesting.utils.DatabaseScheduler;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.context.annotation.Bean;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.servlet.config.annotation.CorsRegistry;
import org.springframework.web.servlet.config.annotation.WebMvcConfigurer;

import javax.validation.Valid;
import java.sql.SQLException;
import java.util.concurrent.TimeUnit;

@RestController
public class MessageController {

    @Autowired
    private MessageDB messageDB;
    private AuthRequests authRequest;

    @Bean
    public WebMvcConfigurer configurer() {
        DatabaseScheduler databaseScheduler = new DatabaseScheduler();
        databaseScheduler.startScheduler(messageDB, TimeUnit.MINUTES);

        return new WebMvcConfigurer() {
            @Override
            public void addCorsMappings(CorsRegistry registry) {
                String originHost = "http://localhost:3003";

                if(System.getenv("cors") != null){
                    originHost = System.getenv("cors");
                }

                registry.addMapping("/*")
                        .allowedMethods("GET", "POST", "DELETE", "PUT")
                        .allowedOrigins(originHost)
                        .allowCredentials(true);
            }
        };
    }

    public MessageController() throws SQLException {
        this.authRequest = new AuthRequests();
    }

    @RequestMapping(value = "/", method = RequestMethod.GET)
    public ResponseEntity<Messages> getMessages() throws SQLException {
        Messages messages = new Messages(messageDB.queryMessages());

        return ResponseEntity.ok(messages);
    }

    @RequestMapping(value = "/count", method = RequestMethod.GET)
    public ResponseEntity<Count> getCount() throws SQLException {
        Count count = new Count(messageDB.getUnreadCount());

        return ResponseEntity.ok(count);
    }

    @RequestMapping(value = "/{id:[0-9]*}", method = RequestMethod.GET)
    public Message getMessage(@PathVariable(value = "id") int id) throws SQLException {
        Message queriedMessage = messageDB.query(id);

        return queriedMessage;
    }

    @RequestMapping(value = "/", method = RequestMethod.POST)
    public ResponseEntity<Message> createMessage(@Valid @RequestBody Message message) throws SQLException {
        Message body = messageDB.create(message);
        return ResponseEntity.ok(body);
    }

    @RequestMapping(value = "/{id:[0-9]*}", method = RequestMethod.DELETE)
    public ResponseEntity deleteMessage(@PathVariable(value = "id") int id, @CookieValue(value ="token", required = false) String token) throws SQLException {
        if(authRequest.postCheckAuth(token)){
            if(messageDB.delete(id)){
                return ResponseEntity.accepted().build();
            } else {
                return ResponseEntity.notFound().build();
            }
        } else {
            return ResponseEntity.status(HttpStatus.FORBIDDEN).build();
        }
    }

    @RequestMapping(value = "/{id:[0-9]*}/read", method = RequestMethod.PUT)
    public ResponseEntity markAsRead(@PathVariable(value = "id") int id, @CookieValue(value ="token", required = false) String token) throws SQLException {
        if(authRequest.postCheckAuth(token)){
            messageDB.markAsRead(id);

            return ResponseEntity.ok().build();
        } else {
            return ResponseEntity.status(HttpStatus.FORBIDDEN).build();
        }
    }
}
