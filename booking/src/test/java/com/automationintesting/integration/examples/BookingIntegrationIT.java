package com.automationintesting.integration.examples;

import com.automationintesting.api.BookingApplication;
import com.automationintesting.model.db.Booking;
import com.automationintesting.model.db.CreatedBooking;
import com.xebialabs.restito.server.StubServer;
import io.restassured.http.ContentType;
import io.restassured.response.Response;
import org.glassfish.grizzly.http.util.HttpStatus;
import org.junit.jupiter.api.AfterEach;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.test.context.ActiveProfiles;
import org.springframework.test.context.junit.jupiter.SpringExtension;

import java.time.LocalDate;
import java.time.Month;

import static com.xebialabs.restito.builder.stub.StubHttp.whenHttp;
import static com.xebialabs.restito.semantics.Action.status;
import static com.xebialabs.restito.semantics.Condition.post;
import static io.restassured.RestAssured.given;
import static org.hamcrest.CoreMatchers.is;
import static org.hamcrest.MatcherAssert.assertThat;

// We need to start the app up to test it. So we use the SpringExtension class and SpringBootTest to configure
// and run the app.
@ExtendWith(SpringExtension.class)
@SpringBootTest(webEnvironment = SpringBootTest.WebEnvironment.DEFINED_PORT, classes = BookingApplication.class)
@ActiveProfiles("dev")
public class BookingIntegrationIT {

    private StubServer server;

    // We add the @Before annotation so that when JUnit runs it knows to run this method before
    // the tests are started. This is known as a hook.
    @BeforeEach
    // We give the before hook a clear name to ensure that it is descriptive in what it is checking
    public void setupRestito() {
        // Booking relies on the Message service so we will mock the message API. We do that by creating a
        // StubServer that we will later configure.
        server = new StubServer(3006).run();

        whenHttp(server).
                match(post("/message/")).
                then(status(HttpStatus.OK_200));
    }

    // Once the test is finished we need to stop the mock server
    @AfterEach
    // We give the after hook a clear name to ensure that it is description in what it's doing
    public void stopServer(){
        server.stop();
    }

    // We add the @Test annotation so that when JUnit runs it knows which
    // methods to run as tests
    @Test
    // We give the check a clear name to ensure that it is descriptive in
    // what it is checking
    public void testCreateBooking(){
        // We want to create a couple of date objects that we are going to us in our bookingPayload
        // and then again in the assertion to make sure they were processed correctly.
        LocalDate checkindate = LocalDate.of(1991, Month.JANUARY, 1);
        LocalDate checkoutdate = LocalDate.of(1991, Month.JANUARY, 2);

        // We next create our booking payload to send to the Booking webservice
        Booking bookingPayload = new Booking.BookingBuilder()
                                            .setRoomid(1)
                                            .setFirstname("Mark")
                                            .setLastname("Winteringham")
                                            .setDepositpaid(true)
                                            .setCheckin(checkindate)
                                            .setCheckout(checkoutdate)
                                            .setEmail("mark@mwtestconsultancy.co.uk")
                                            .setPhone("01928123456")
                                            .build();

        // We then send our request to the Booking webservice to create our booking
        Response bookingResponse = given()
                                    .contentType(ContentType.JSON)
                                    .body(bookingPayload)
                                   .when()
                                    .post("http://localhost:3000/booking/");

        System.out.println(bookingResponse.getBody().prettyPrint());

        // Once we get a response we extract the body and map it to CreatedBooking
        CreatedBooking response = bookingResponse.as(CreatedBooking.class);

        // Finally we assert on the various values we get from the HTTP response body
        assertThat(response.getBooking().getFirstname(), is("Mark"));
        assertThat(response.getBooking().getLastname(), is("Winteringham"));
        assertThat(response.getBooking().isDepositpaid(), is(true));
        assertThat(response.getBooking().getBookingDates().getCheckin(), is(checkindate));
        assertThat(response.getBooking().getBookingDates().getCheckout(), is(checkoutdate));
    }


//    ...Integration check suggestions
//
//    Check each service integrates and read / writes to the service
//    Check each service integrates with the Auth web service
//    Check room and booking services integrate with one another

}
