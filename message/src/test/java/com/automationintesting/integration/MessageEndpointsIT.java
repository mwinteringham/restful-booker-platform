package com.automationintesting.integration;

import com.automationintesting.api.MessageApplication;
import com.automationintesting.model.Message;
import com.github.tomakehurst.wiremock.common.ConsoleNotifier;
import com.github.tomakehurst.wiremock.core.WireMockConfiguration;
import com.github.tomakehurst.wiremock.junit.WireMockRule;
import io.restassured.http.ContentType;
import io.restassured.response.Response;
import org.approvaltests.Approvals;
import org.junit.Before;
import org.junit.Rule;
import org.junit.Test;
import org.junit.runner.RunWith;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.test.context.ActiveProfiles;
import org.springframework.test.context.junit4.SpringRunner;

import static com.github.tomakehurst.wiremock.client.WireMock.*;
import static com.github.tomakehurst.wiremock.client.WireMock.aResponse;
import static io.restassured.RestAssured.given;

import static org.hamcrest.CoreMatchers.is;
import static org.junit.Assert.assertThat;

@RunWith(SpringRunner.class)
@SpringBootTest(webEnvironment = SpringBootTest.WebEnvironment.DEFINED_PORT, classes = MessageApplication.class)
@ActiveProfiles("dev")
public class MessageEndpointsIT {

    @Rule
    public WireMockRule wireMockRule = new WireMockRule(WireMockConfiguration.options().notifier(new ConsoleNotifier(true)).port(3004));

    @Before
    public void setupWiremock(){
        stubFor(post("/auth/validate")
                .withRequestBody(equalToJson("{ \"token\": \"abc123\" }"))
                .willReturn(aResponse().withStatus(200)));
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

        assertThat(response.statusCode(), is(202));
    }

    @Test
    public void validationTest(){
        Response response = given()
                .contentType(ContentType.JSON)
                .body("{}")
                .when()
                .post("http://localhost:3006/message/");

        assertThat(response.statusCode(), is(400));
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
