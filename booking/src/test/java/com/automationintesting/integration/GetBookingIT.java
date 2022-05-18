package com.automationintesting.integration;

import com.automationintesting.api.BookingApplication;
import com.xebialabs.restito.server.StubServer;
import io.restassured.response.Response;
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
import static org.junit.Assert.assertEquals;

@ExtendWith(SpringExtension.class)
@SpringBootTest(webEnvironment = SpringBootTest.WebEnvironment.DEFINED_PORT, classes = BookingApplication.class)
@ActiveProfiles("dev")
public class GetBookingIT {

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

        // Mock takes time to stop so we have to wait for it to complete
        Thread.sleep(1500);
    }

    @Test
    public void getValidBooking(){
        Response response = given()
                                .cookie("token", "abc123")
                                .get("http://localhost:3000/booking/1");

        assertEquals(200, response.getStatusCode());
    }

    @Test
    public void getInvalidBooking(){
        Response response = given()
                                .cookie("token", "abc123")
                                .get("http://localhost:3000/booking/1000");

        response.getBody().prettyPrint();

        assertEquals(404, response.getStatusCode());
    }

}
