package com.automationintesting.integration;

import com.automationintesting.api.BookingApplication;
import com.automationintesting.model.db.Booking;
import com.xebialabs.restito.server.StubServer;
import io.restassured.http.ContentType;
import io.restassured.response.Response;
import org.approvaltests.Approvals;
import org.glassfish.grizzly.http.util.HttpStatus;
import org.junit.After;
import org.junit.Before;
import org.junit.Test;
import org.junit.runner.RunWith;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.test.context.ActiveProfiles;
import org.springframework.test.context.junit4.SpringRunner;

import java.util.Date;
import java.util.GregorianCalendar;

import static com.xebialabs.restito.builder.stub.StubHttp.whenHttp;
import static com.xebialabs.restito.semantics.Action.status;
import static com.xebialabs.restito.semantics.Condition.post;
import static io.restassured.RestAssured.given;

@RunWith(SpringRunner.class)
@SpringBootTest(webEnvironment = SpringBootTest.WebEnvironment.DEFINED_PORT, classes = BookingApplication.class)
@ActiveProfiles("dev")
public class MessageRequestIT {

    StubServer server = new StubServer(3006).run();

    @Before
    public void setupRestito(){
        whenHttp(server).
                match(post("/message/")).
                then(status(HttpStatus.OK_200));
    }

    @After
    public void stopServer(){
        server.stop();
    }

    @Test
    public void testSendingToMessageAPI(){
        Date checkindate = new GregorianCalendar(1990,1,1).getTime();
        Date checkoutdate = new GregorianCalendar(1990,1,2).getTime();

        Booking bookingPayload = new Booking.BookingBuilder()
                .setRoomid(1)
                .setFirstname("Mark")
                .setLastname("Winteringham")
                .setDepositpaid(true)
                .setCheckin(checkindate)
                .setCheckout(checkoutdate)
                .setEmail("mark@mwtestconsultancy.co.uk")
                .setPhone("01292123456")
                .build();

        Response bookingResponse = given()
                .contentType(ContentType.JSON)
                .body(bookingPayload)
                .when()
                .post("http://localhost:3000/booking/");

        Approvals.verify(server.getCalls().get(0).getPostBody());
    }

}
