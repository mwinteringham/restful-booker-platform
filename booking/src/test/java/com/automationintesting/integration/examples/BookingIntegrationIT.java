package com.automationintesting.integration.examples;

import com.automationintesting.api.BookingApplication;
import com.github.tomakehurst.wiremock.common.ConsoleNotifier;
import com.github.tomakehurst.wiremock.core.WireMockConfiguration;
import com.github.tomakehurst.wiremock.junit.WireMockRule;
import io.restassured.http.ContentType;
import io.restassured.response.Response;
import com.automationintesting.model.Booking;
import com.automationintesting.model.CreatedBooking;
import org.junit.Before;
import org.junit.Rule;
import org.junit.Test;
import org.junit.runner.RunWith;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.test.context.ActiveProfiles;
import org.springframework.test.context.junit4.SpringRunner;

import java.util.Date;
import java.util.GregorianCalendar;

import static com.github.tomakehurst.wiremock.client.WireMock.*;
import static io.restassured.RestAssured.given;
import static org.hamcrest.CoreMatchers.is;
import static org.hamcrest.MatcherAssert.assertThat;

// We need to start the app up to test it. So we use the SpringRunner class and SpringBootTest to configure
// and run the app.
@RunWith(SpringRunner.class)
@SpringBootTest(webEnvironment = SpringBootTest.WebEnvironment.DEFINED_PORT, classes = BookingApplication.class)
@ActiveProfiles("dev")
public class BookingIntegrationIT {

    // Booking relies on an Auth service so we add the JUnit rule to setup Wiremock which
    // will mock the behaviour of the Auth service, rather than stand up an Auth service
    @Rule
    public WireMockRule wireMockRule = new WireMockRule(WireMockConfiguration.options().notifier(new ConsoleNotifier(true)).port(3006));

    // We add the @Before annotation so that when JUnit runs it knows to run this method before
    // the tests are started. This is known as a hook.
    @Before
    // We give the before hook a clear name to ensure that it is descriptive in what it is checking
    public void setupWiremock(){
        // Configure Wiremock for the Message service to send a positive validate response
        stubFor(post("/message/")
                .willReturn(aResponse().withStatus(200)));
    }

    // We add the @Test annotation so that when JUnit runs it knows which
    // methods to run as tests
    @Test
    // We give the check a clear name to ensure that it is descriptive in
    // what it is checking
    public void testCreateBooking(){
        // We want to create a couple of date objects that we are going to us in our bookingPayload
        // and then again in the assertion to make sure they were processed correctly.
        Date checkindate = new GregorianCalendar(1991,1,1).getTime();
        Date checkoutdate = new GregorianCalendar(1991,1,2).getTime();

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
