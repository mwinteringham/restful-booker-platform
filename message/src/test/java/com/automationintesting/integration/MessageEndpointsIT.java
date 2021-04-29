package com.automationintesting.integration;

import com.automationintesting.api.MessageApplication;
import com.automationintesting.model.db.Message;
import com.xebialabs.restito.server.StubServer;
import io.restassured.http.ContentType;
import io.restassured.response.Response;
import org.approvaltests.Approvals;
import org.glassfish.grizzly.http.util.HttpStatus;
import org.junit.jupiter.api.AfterEach;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.test.context.ActiveProfiles;
import org.springframework.test.context.junit.jupiter.SpringExtension;

import static com.xebialabs.restito.builder.stub.StubHttp.whenHttp;
import static com.xebialabs.restito.semantics.Action.status;
import static com.xebialabs.restito.semantics.Condition.post;
import static io.restassured.RestAssured.given;
import static org.junit.jupiter.api.Assertions.assertEquals;

@ExtendWith(SpringExtension.class)
@SpringBootTest(webEnvironment = SpringBootTest.WebEnvironment.DEFINED_PORT, classes = MessageApplication.class)
@ActiveProfiles("dev")
public class MessageEndpointsIT {

    StubServer server = new StubServer(3004).run();

    @BeforeEach
    public void setupRestito(){
        whenHttp(server).
                match(post("/auth/validate")).
                then(status(HttpStatus.OK_200));
    }

    @AfterEach
    public void stopServer() throws InterruptedException {
        server.stop();

       // We have to wait for the mock to catch up and shutdown the mock before we can continue
       Thread.sleep(1000);
    }

    @Test
    public void createMessage(){
        Message messagePayload = new Message("Mark", "test@email.com", "01234556789", "Subject line goes in here for display", "Description details here to give info on request");

        Response response = given()
                .contentType(ContentType.JSON)
                .body(messagePayload)
                .when()
                .post("http://localhost:3006/message/");

        Approvals.verify(response.getBody().prettyPrint());
    }

    @Test
    public void getMessage(){
        Response response = given()
                .get("http://localhost:3006/message/1");

        Approvals.verify(response.getBody().prettyPrint());
    }

    @Test
    public void getMessages(){
        Response response = given()
                .get("http://localhost:3006/message/");

        Approvals.verify(response.getBody().prettyPrint());
    }

    @Test
    public void getCount(){
        Response response = given()
                .get("http://localhost:3006/message/count");

        Approvals.verify(response.getBody().prettyPrint());
    }

    @Test
    public void deleteMessage(){
        Message messagePayload = new Message("Mark", "test@email.com", "01234556789", "Subject line goes in here for display", "Description details here to give info on request");

        Message createdMessage = given()
                .contentType(ContentType.JSON)
                .body(messagePayload)
                .when()
                .post("http://localhost:3006/message/")
                .getBody().as(Message.class);

        Response response = given()
                .cookie("token", "abc123")
                .delete("http://localhost:3006/message/" + createdMessage.getMessageid());

        assertEquals(response.statusCode(), 202);
    }

    @Test
    public void validationTest(){
        Response response = given()
                .contentType(ContentType.JSON)
                .body("{}")
                .when()
                .post("http://localhost:3006/message/");

        assertEquals(response.statusCode(), 400);
    }

    @Test
    public void markAsReadTest(){
        Message messagePayload = new Message("Mark", "test@email.com", "01234556789", "Subject line goes in here for display", "Description details here to give info on request");

        Message createdMessage = given()
                .contentType(ContentType.JSON)
                .body(messagePayload)
                .when()
                .post("http://localhost:3006/message/")
                .getBody().as(Message.class);

        given()
            .cookie("token", "abc123")
            .put("http://localhost:3006/message/" + createdMessage.getMessageid() + "/read");


        Response response = given()
                .get("http://localhost:3006/message/count");

        Approvals.verify(response.getBody().prettyPrint());
    }

}
